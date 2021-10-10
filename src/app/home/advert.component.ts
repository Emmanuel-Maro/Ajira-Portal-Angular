import { OnInit, Component, ViewChild, Inject, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TokenParams } from '../models/token-params';
import { AppService } from '../shared/service/app.service';
import jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource } from "@angular/material";
import { AdvertService } from "./service/advert.service";
import { DialogService } from "../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../shared/service/auth.service";
import { Router } from "@angular/router";

@Component({
	templateUrl: './advert.component.html',
	styleUrls: ['./advert.component.css'],
})

export class AdvertComponent implements OnInit, OnDestroy  {
    firstLevelTimer:number = 125;
    secondLevelTimer:number = 1;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;
    FULL_DASH_ARRAY = 283;
    tokenParams: TokenParams;
    loading:boolean = false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    vacanciesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    searchKey:string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private adVertService: AdvertService, private dialogService: DialogService,
    private authService:AuthService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router, private changeDetectorRef:ChangeDetectorRef, private spinner: NgxSpinnerService){
       if(this.authService.isLoggedIn()){
          this.loading = true;
          this.adVertService.vacancies().subscribe(result=>{ 
            this.loading = false;
            this.vacanciesDataSource.data = result.data;
            this.vacanciesDataSource.paginator = this.paginator;
            this.vacanciesDataSource._updateChangeSubscription();
          }, errorResponse=> {
            this.loading = false; console.log(errorResponse);
            this.changeDetectorRef.detectChanges();
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else
            this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
          });
       }
       else{
            this.loading = true;
            this.adVertService.publicVacancies().subscribe(result=>{ 
              this.loading = false;
              this.vacanciesDataSource.data = result.data;
              this.vacanciesDataSource.paginator = this.paginator;
              this.vacanciesDataSource._updateChangeSubscription();
              console.log(result);
            }, errorResponse=> {console.log(errorResponse)
              this.loading = false;
              this.changeDetectorRef.detectChanges();
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
            });
       }

    }

      ngOnInit(): void {
          this.displayedColumns = ['codeNumber', 'closingDate' ];
      }  

      ngOnDestroy(): void {
        console.log('on destroy method called');
      }

      applyFilter() {
          this.vacanciesDataSource.filter = this.searchKey.trim().toLowerCase();// Remove whitespace//
      }

      onSearchClear(){
        this.searchKey = "";
        this.applyFilter();
      }


      profileCheck(advertId:number): void {
        if(this.authService.isLoggedIn()){
          this.adVertService.profileCheck(advertId).subscribe(result=>{
            //Maro - for testing education application
            this.router.navigate(['/applicant/education']);
            
            //this.router.navigate(['/home/apply', advertId, result.data.verificationToken])
              console.log(result)
          }, errorResponse=> {
                this.router.navigate(['/applicant/education']);
                // if(errorResponse && errorResponse.message)
                // this.dialogService.openAlertCustomDialog(errorResponse.message, "error");
                // else this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
            });
        }//home/advert-details/3081
        else  //this.router.navigate(['/login'])
        this.router.navigate(['login',{next: `/home/advert-details/${advertId}`}], { state: {redirectUrl:  `/home/advert-details/${advertId}`} });//ok
      }

      openSnackBar(message: string, type:string) {
        this.snackBar.open(message, 'close', {
          duration: 5000,
          panelClass: [type],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
}

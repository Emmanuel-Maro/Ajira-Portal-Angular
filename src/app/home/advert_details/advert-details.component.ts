import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource } from "@angular/material";
import { AuthService } from "../../shared/service/auth.service";
import { AdvertService } from "../service/advert.service";
import { DialogService } from "../../shared/service/dialog.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { SafeHtmlPipe } from "../../shared/pipes/SafeHtmlPipe";

@Component({
	templateUrl: './advert-details.component.html',
	styleUrls: ['./advert-details.component.css'],
})

export class AdvertDetailsComponent implements OnInit {
    advertDetails:any ;
    advert_id:number;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private authService: AuthService, private adVertService: AdvertService, 
    private route: ActivatedRoute, private snackBar: MatSnackBar, private dialogService: DialogService, private router:Router, private changeDetectorRef: ChangeDetectorRef){

       this.advert_id = +this.route.snapshot.paramMap.get('advert_id');
       if(this.authService.isLoggedIn()){
          this.adVertService.vacancyDetails(this.advert_id ).subscribe(result=>{ 
            this.advertDetails = result.data;
            this.changeDetectorRef.detectChanges();
          }, errorResponse=> {
            //this.spinner.hide();
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else this.dialogService.openAlertDialog("Error", "an error occurred while trying to fetch data from remote server", "error");
          });
       }
       else{
          this.adVertService.publicVacancyDetails(this.advert_id ).subscribe(result=>{ 
            this.advertDetails = result.data;
            this.changeDetectorRef.detectChanges();
          }, errorResponse=> {
            //this.spinner.hide();
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else this.dialogService.openAlertDialog("Error", "an error occurred while trying to fetch data from remote server", "error");
          });
       }
    }

    ngOnInit(): void {
       
    }  

    isAuthenticated():boolean{
      return this.authService.isLoggedIn();
    }

    profileCheck(advertId:number): void{
      this.adVertService.profileCheck(advertId).subscribe(result=>{
        this.router.navigate(['/applicant/health']);
        //this.router.navigate(['/home/apply', advertId, result.data.verificationToken])
          console.log(result)
      }, errorResponse=> {
        this.router.navigate(['/applicant/health']);
            // if(errorResponse && errorResponse.message)
            // this.dialogService.openAlertCustomDialog(errorResponse.message, "error");
            // else this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
        });
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

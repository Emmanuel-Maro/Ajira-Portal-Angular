import { OnInit, Component, ViewChild, Inject, Optional, ChangeDetectorRef } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../../shared/service/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AdvertService } from "../service/advert.service";
import { DialogService } from "../../shared/service/dialog.service";

@Component({
	templateUrl: './interview-time-table-dialog-form.html',
	styleUrls: ['./interview-time-table-dialog-form.css']
})

export class InterviewTimeTableDialogForm implements OnInit {
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    advertId:number;

    post:string;
    employer:string;

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private advertService: AdvertService, private authService: AuthService, public matDialogRef: MatDialogRef<InterviewTimeTableDialogForm>, private changeDetectorRef:ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,private dialogService: DialogService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService){
        this.advertId = this.data.advertId;
        this.advertService.viewTimeTable(this.advertId).subscribe(result=>{
          this.dataSource.data =  result.data || [];
          if(this.dataSource.data.length > 0){
             this.post = this.dataSource.data[0].post;
             this.employer = this.dataSource.data[0].employer;
          }

        },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
          })
    }
    
    ngOnInit(): void {
      this.displayedColumns = ['interviewTitle', 'venue', 'interviewDate']; 
    }  

    onClose(){;
      this.matDialogRef.close();
    }

    translateCategory(catId:number):string{
      switch(catId){
        case 1: return "Written"; break;
        case 2: return "Practical"; break;
        case 3 : return "Oral"; break;
        default:  return '';
      }
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

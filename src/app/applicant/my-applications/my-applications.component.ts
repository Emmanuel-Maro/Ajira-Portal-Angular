import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef, ApplicationInitStatus } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DATE_FORMATS} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { InterviewTimeTableDialogForm } from "../../home/dialog-forms/interview-time-table-dialog-form";
import { environment } from "../../../environments/environment";
import { DocPreviewDialogComponent } from "../../home/preview-dialog/doc-preview-dialog.component";

export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
    },
    display: {
        dateInput: { year: 'numeric', month: 'short',  day: 'numeric' },
        monthYearLabel: { year: 'numeric' }
    }
};

@Component({
    templateUrl: './my-applications.component.html',
    styleUrls: ['./my-applications.component.css'],
    providers: [
      {
         provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
      }]
  })

  export class MyApplicationsComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('inputFile') applicationLetter: ElementRef;
    searchKey:string;
    loading:boolean = true;
    applicationLetterIsSigned:boolean = false;
    fileObject:any = {};
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
         
          this.applicantService.myApplications().subscribe(result=>{
              this.applicantService.myApplications().subscribe(result=>{ console.log(result)
                this.loading = false;
                this.dataSource.data = result.data || []; 
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.dataSource._updateChangeSubscription();

              })
          },errorResponse=>{
            this.loading = false;
            this.changeDetectorRef.detectChanges();
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        });
      }

      ngOnInit(): void {    

        this.displayedColumns = ['status', 'title', 'applicationDate', 'closeDate', 'actions'];                            
      }

      applyFilter() {
        this.dataSource.filter = this.searchKey.trim().toLowerCase();// Remove whitespace//
      }

      onSearchClear(){
        this.searchKey = "";
        this.applyFilter();
      }

      viewTimeTable(advertId:number):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'advertId': advertId};
        this.dialog.open(InterviewTimeTableDialogForm, dialogConfig);
      }

      translateApplicationStatus(status:string): string{
        switch(status){ 
          case null : return 'Received';
          case '1': return 'SHORTLISTED';
          case '2':  return 'FIRST INTERVIEW';
          case '3':  return 'SECOND INTERVIEW';
          case '4':  return 'THIRD INTERVIEW';
          case '5':  return 'PLACEMENT';
          default: return '';
        }
      }

      onFileChange(event, advertId:number) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
          let file = event.target.files[0];
          reader.readAsDataURL(file); 
          reader.onloadend = () => { 
            if(file.size/(1024) <= 1024){
              const dialogConfig = new MatDialogConfig();
              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.width = "72%";
              dialogConfig.data = (<string>reader.result).split(',')[1];
              this.dialog.open(DocPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
                if(choice){
                  this.fileObject.fileName = file.name;
                  this.fileObject.fileType = file.type.split('/')[1];
                  this.fileObject.fileSize = file.size;
                  this.fileObject.fileData = (<string>reader.result).split(',')[1];   
                  this.applicationLetterIsSigned = choice;
                  this.changeDetectorRef.detectChanges();
                  let payload = {
                    "advertId": advertId,
                    "applicationLetter": {
                      "content": this.fileObject.fileData,
                      "fileType": this.fileObject.fileType
                    },
                  }
                  this.applicantService.editApplication(payload).subscribe(result=>{
                    this.openSnackBar("application letter has been replaced successfully", "success-snackbar");
                  },errorResponse=> {
                    this.spinner.hide();
                    console.log(errorResponse);
                    if(errorResponse && errorResponse.message)
                      this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
                    else {
                      this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
                    } 
                  });
                }
                else {
                  this.applicationLetter.nativeElement.value = '';
                  this.applicationLetterIsSigned = false;
                  this.changeDetectorRef.detectChanges();
                }
              });
            }
            else{
              this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
              this.applicationLetter.nativeElement.value = '';
              this.applicationLetterIsSigned = false;
              this.changeDetectorRef.detectChanges();
            }
          };
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

      appStatus(status:any):string { 
        if(status == null){
          return "Received"
        }
        else  if(status == false){
          return "Not Shortlisted";
        }
        else  if(status == true){
          return "Shortlisted";
        }
      }

      showApplicationLetter(closeDate:string, dateApplied:string):boolean { 
        let close_Date = new Date(closeDate);
        let applied_Date = new Date(dateApplied);
        let current_Date =  new Date();

        if(close_Date.getTime() > applied_Date.getTime() && close_Date.getTime() >=current_Date.getTime() ){
          return true;
        }
        else return false;
      }
      
  }
  
  
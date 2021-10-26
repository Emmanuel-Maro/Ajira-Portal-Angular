import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef, Optional, Inject } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DIALOG_DATA} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { RefereeDialogForm } from "../applicant-dialog-forms/referee-dialog-form.component";
import { environment } from "../../../environments/environment";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";

@Component({
    templateUrl: './other-personal-details-dialog-form.component.html',
    styleUrls: ['./other-personal-details-dialog-form.component.css']
  })

  export class OtherPersonalDetailsDialogFormComponent implements OnInit {
    originalities = environment.Originalities;
    govStatus =  environment.YES_NO_CHOICES;
    maritalStatus = environment.MARITAL_STATUS;
    impairments:any =  environment.DISABILITIES;
    originality:string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
   
      constructor(public applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<OtherPersonalDetailsDialogFormComponent>, private dialogService: DialogService, private spinner: NgxSpinnerService){
         
      }

      ngOnInit(): void {    
       this.applicantService.OtherPersonalDetailsForm.reset();
       if(this.data && this.data.originality){
        this.originality = this.data.originality;
       }
      }

      onSubmit():void{  
        if(this.originality) this.applicantService.OtherPersonalDetailsForm.controls['originality'].setValue(this.originality);
        this.applicantService.OtherPersonalDetailsForm.markAllAsTouched();
        
        if(this.applicantService.OtherPersonalDetailsForm.valid){
          let request = this.applicantService.OtherPersonalDetailsForm.value;
            this.applicantService.updatePersonalDetails(request).subscribe(result=>{
              this.matDialogRef.close(result.data);
            },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "");
                this.matDialogRef.close();
              } 
          });
        }
      }

//this.openSnackBar("please complete all required fields!", "warning-snackbar");"success-snackbar"
      openSnackBar(message: string, type:string) {
        this.snackBar.open(message, 'close', {
          duration: 5000,
          panelClass: [type],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }

      onClose(){
        this.matDialogRef.close();
      }
      
  }
  
  
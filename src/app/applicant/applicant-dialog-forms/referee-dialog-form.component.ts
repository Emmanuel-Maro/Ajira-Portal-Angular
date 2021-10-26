
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";


@Component({
    templateUrl: './referee-dialog-form.component.html',
    styleUrls: ['./referee-dialog-form.component.css']
  })

  export class RefereeDialogForm implements OnInit {

    titles:any[] = environment.TITLES;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, private snackBar: MatSnackBar,
      public matDialogRef: MatDialogRef<RefereeDialogForm>, private changeDetectorRef:ChangeDetectorRef,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){

    }

    ngOnInit(): void { 
      this.applicantService.RefereeForm.reset();
      if(this.data && this.data.refereeData){
           this.populateRefereeData(this.data.refereeData);
      }
    }

    populateRefereeData(data:any):void{ console.log(data)
      this.applicantService.RefereeForm.controls['refereeId'].setValue(data.refereeId);
      this.applicantService.RefereeForm.controls['fullName'].setValue(data.fullName);
      this.applicantService.RefereeForm.controls['refereeTitle'].setValue(data.refereeTitle);
      this.applicantService.RefereeForm.controls['refereeOrganization'].setValue(data.refereeOrganization);
      this.applicantService.RefereeForm.controls['emailAddress'].setValue(data.emailAddress);
      this.applicantService.RefereeForm.controls['telephoneNumber'].setValue(data.telephoneNumber);
      this.applicantService.RefereeForm.controls['refereeAddress'].setValue(data.refereeAddress);
    }

    onSubmit():void{
      this.applicantService.RefereeForm.markAllAsTouched();
      if (this.applicantService.RefereeForm.valid) {
        let referee = this.applicantService.RefereeForm.value;
        referee.fullName = referee.fullName.toUpperCase();
        referee.refereeOrganization = referee.refereeOrganization.toUpperCase();
        referee.refereeTitle = referee.refereeTitle.toUpperCase();
        if(this.data.operation === 'Insert'){ //insert 
            this.applicantService.addReferee(referee).subscribe(result=> { 
              this.matDialogRef.close(referee);

            },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
          });
          
        }
        else{ //update
          this.applicantService.updateReferee(referee).subscribe(result=> { 
            this.matDialogRef.close(referee);

          },errorResponse=>{
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        })
         
        }
       
      }
    }

    onClose(){
     // this.certificationService.FacilityForm.reset();
      //this.certificationService.initializeFacilityForm();
      this.matDialogRef.close();
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


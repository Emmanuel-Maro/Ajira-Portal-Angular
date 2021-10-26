
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";


export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      // dateInput: 'DD.MM.YYYY',
    },
    display: {
        dateInput: { year: 'numeric', month: 'short',  day: 'numeric' },
        monthYearLabel: { year: 'numeric' }
    }
};

@Component({
    templateUrl: './training-dialog-form.component.html',
    styleUrls: ['./training-dialog-form.component.css'],
    providers: [ { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
  })

  export class TrainingDialogForm implements OnInit {

    fileObject:any = {};
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    today:Date = new Date();
    maxStartDate:Date;
    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, 
      public matDialogRef: MatDialogRef<TrainingDialogForm>, private changeDetectorRef:ChangeDetectorRef, private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){

    }

    ngOnInit(): void { 
      this.applicantService.TrainingForm.reset();
      this.maxStartDate = new Date();
      if(this.data && this.data.trainingData){
           this.populateTrainingData(this.data.trainingData);
      }
    }

    endDateChange(event):void{
      this.maxStartDate = event.value;
    }

    populateTrainingData(data:any):void{
      this.applicantService.TrainingForm.controls['trainingId'].setValue(data.trainingId);
      this.applicantService.TrainingForm.controls['trainingName'].setValue(data.trainingName);
      this.applicantService.TrainingForm.controls['trainingDescription'].setValue(data.trainingDescription);
      this.applicantService.TrainingForm.controls['trainingInstitution'].setValue(data.trainingInstitution);
      this.applicantService.TrainingForm.controls['startDate'].setValue(data.startDate);
      this.applicantService.TrainingForm.controls['endDate'].setValue(data.endDate);
    }

    
    onFileChange(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){
              this.fileObject.fileName = file.name;
              this.fileObject.fileExtension = file.type.split('/')[1];
              this.fileObject.fileSize = file.size;
              this.fileObject.fileData = (<string>reader.result).split(',')[1];  
              this.applicantService.TrainingForm.controls['file'].setValue(this.fileObject.fileData);
              this.applicantService.TrainingForm.controls['fileExtension'].setValue(this.fileObject.fileExtension);
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
          }
        };
      }
      
    }

    onSubmit():void{
      this.applicantService.TrainingForm.markAllAsTouched();
      if (this.applicantService.TrainingForm.valid) {
          let training = this.applicantService.TrainingForm.value;
          training.trainingName = training.trainingName.toUpperCase();
          training.trainingInstitution = training.trainingInstitution.toUpperCase();
          if(this.data.operation === 'Insert'){ 
            this.applicantService.addTraining(training).subscribe(result=>{
              console.log(result);
              training.trainingId = result.data.trainingId;
                this.matDialogRef.close(training);
            },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred while trying to update data from remote server", "warning-snackbar");
              } 
            })
          
          }
          else { //update operation
            this.applicantService.updateTraining(training).subscribe(result => {
              console.log(result);
              this.matDialogRef.close(training);
            },errorResponse=>{
            console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred while trying to update data from remote server", "warning-snackbar");
              } 
            });       
          }
       
      }
      else{
        console.log('not valid')
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

    onClose(){
     // this.certificationService.FacilityForm.reset();
      //this.certificationService.initializeFacilityForm();
      this.matDialogRef.close();
    }




  }


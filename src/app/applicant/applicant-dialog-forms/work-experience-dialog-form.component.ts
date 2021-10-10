
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";

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
    templateUrl: './work-experience-dialog-form.component.html',
    styleUrls: ['./work-experience-dialog-form.component.css'],
    providers: [ { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
  })

  export class WorkExperienceDialogForm implements OnInit {
    currentJob:boolean = false;
    today:Date = new Date();
    maxStartDate:Date;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, private snackBar: MatSnackBar,
      public matDialogRef: MatDialogRef<WorkExperienceDialogForm>, private changeDetectorRef:ChangeDetectorRef,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){

    }

    ngOnInit(): void { 
      this.applicantService.WorkExperienceForm.reset();
      this.maxStartDate = new Date();
      if(this.data && this.data.dialogData){
           this.populateWorkExperienceData(this.data.dialogData);
      }
    }

    endDateChange(event):void{
      this.maxStartDate = event.value;
    }


    populateWorkExperienceData(data:any):void {  console.log(data)
      this.applicantService.WorkExperienceForm.controls['workingExperienceId'].setValue(data.workingExperienceId);
      this.applicantService.WorkExperienceForm.controls['instituteName'].setValue(data.instituteName);
      this.applicantService.WorkExperienceForm.controls['currentJob'].setValue(data.currentJob);
      this.applicantService.WorkExperienceForm.controls['jobTitle'].setValue(data.jobTitle);
      this.applicantService.WorkExperienceForm.controls['dutiesResponsiblities'].setValue(data.dutiesResponsibilites);
      this.applicantService.WorkExperienceForm.controls['immediateSupervisor'].setValue(data.supervisorName);
      this.applicantService.WorkExperienceForm.controls['supervisorTelephoneNumber'].setValue(data.supervisorPhone);
      this.applicantService.WorkExperienceForm.controls['supervisorAddress'].setValue(data.supervisorAddress);
      this.applicantService.WorkExperienceForm.controls['dateFrom'].setValue(data.dateFrom);
      this.applicantService.WorkExperienceForm.controls['dateTo'].setValue(data.dateTo);
      this.currentJob = data.currentJob == 'Y'  ? true: false;
    }

    onSubmit():void{
      this.applicantService.WorkExperienceForm.markAllAsTouched();
      if (this.applicantService.WorkExperienceForm.valid) {
        if(this.currentJob){
          this.applicantService.WorkExperienceForm.controls['currentJob'].setValue('Y');
          this.applicantService.WorkExperienceForm.controls['dateTo'].setValue(null);
        }
        else  this.applicantService.WorkExperienceForm.controls['currentJob'].setValue('N');
        if(this.data.operation === 'Insert'){ //insert 
          let working_exp = this.applicantService.WorkExperienceForm.value;
          working_exp.instituteName = working_exp.instituteName.toUpperCase();
          working_exp.jobTitle = working_exp.jobTitle.toUpperCase();
          working_exp.immediateSupervisor = working_exp.immediateSupervisor.toUpperCase();
          
          this.applicantService.addWorkingExperience(working_exp).subscribe(result=>{
            //this.openSnackBar("working experience has been added successfully..", "success-snackbar");
            this.matDialogRef.close({'data': working_exp});
          });
        }
        else{ //update
          let working_exp = this.applicantService.WorkExperienceForm.value;
          working_exp.instituteName = working_exp.instituteName.toUpperCase();
          working_exp.jobTitle = working_exp.jobTitle.toUpperCase();
          working_exp.immediateSupervisor = working_exp.immediateSupervisor.toUpperCase();
          this.applicantService.updateWorkingExperience(working_exp).subscribe(result=>{
            //this.openSnackBar("working experience has been removed successfully..", "success-snackbar");
            this.matDialogRef.close({'data':this.applicantService.WorkExperienceForm.value});
          });
        }
       
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

    onClose(){;
      this.matDialogRef.close();
    }

  }


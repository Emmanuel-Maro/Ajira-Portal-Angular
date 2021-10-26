
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";
import { Validators } from "@angular/forms";


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
    templateUrl: './professional-qualification-dialog-form.component.html',
    styleUrls: ['./professional-qualification-dialog-form.component.css'],
    providers: [ { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
  })

  export class ProfessionalQualificationDialogForm implements OnInit {
    fileObject:any = {};
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    countries:any[] = [];
    courseNames:any[] = [];
    institutionNames:any[] = [];
    years: any[] =[];
    errborder:string ;
    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, 
      public matDialogRef: MatDialogRef<ProfessionalQualificationDialogForm>, private changeDetectorRef:ChangeDetectorRef, private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){

          this.applicantService.countries().subscribe(result => { 
            //if(result.data.length > 0){
              this.countries = result.data || [];
              //let countryTz =  _.find(this.countries, {phonecode: 255}); 
              //this.applicantService.ProfessionalQualificationForm.controls['countryId'].setValue(countryTz.id);
            //}
          },errorResponse=>{
           console.log(errorResponse);
           if(errorResponse && errorResponse.message)
             this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
           else {
             this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
           } 
       });

       this.applicantService.professionalInstitutions().subscribe(result=>{ console.log(result.data)
         this.institutionNames = result.data;
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
      this.applicantService.ProfessionalQualificationForm.reset();
      let currentYear = new Date().getFullYear();
      for(var i=1; i<=60; i++){
        this.years.push({'year': currentYear--});
      }
      if(this.data && this.data.professionalData){
           this.populateProfessionalData(this.data.professionalData);
      }
    }

    onInstitutionNameSelect(institutionId:number):void{
      this.applicantService.ProfessionalQualificationForm.controls['courseId'].setValue(null);
      this.applicantService.professionalCourses(institutionId).subscribe(result =>{ 
            this.courseNames = result.data;
      },errorResponse=>{
        console.log(errorResponse);
        if(errorResponse && errorResponse.message)
          this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
        else {
          this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
        } 
    });
    }

    populateProfessionalData(data:any):void { 
      /*this.applicantService.ProfessionalQualificationForm.controls['professionalQualificationID'].setValue(data.professionalQualificationID);
      this.applicantService.ProfessionalQualificationForm.controls['institutionName'].setValue(data.institutionName);
      this.applicantService.ProfessionalQualificationForm.controls['courseName'].setValue(data.courseName);
      this.applicantService.ProfessionalQualificationForm.controls['countryId'].setValue(data.countryID);
      this.applicantService.ProfessionalQualificationForm.controls['startDate'].setValue(data.startDate);
      this.applicantService.ProfessionalQualificationForm.controls['endDate'].setValue(data.endDate);
      this.applicantService.ProfessionalQualificationForm.controls['certificate'].setValue(data.certificate);*/
    }

    onCountrySelect():void{
      if(this.applicantService.ProfessionalQualificationForm.controls['countryId'].value === 1){
        this.applicantService.ProfessionalQualificationForm.controls['institutionId'].setValidators(Validators.required); this.applicantService.ProfessionalQualificationForm.controls['institutionId'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['courseId'].setValidators(Validators.required); this.applicantService.ProfessionalQualificationForm.controls['courseId'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['otherInstituteName'].clearValidators(); this.applicantService.ProfessionalQualificationForm.controls['otherInstituteName'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['otherCourseName'].clearValidators();  this.applicantService.ProfessionalQualificationForm.controls['otherCourseName'].updateValueAndValidity();
      }
      else{
        this.applicantService.ProfessionalQualificationForm.controls['institutionId'].clearValidators(); this.applicantService.ProfessionalQualificationForm.controls['institutionId'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['courseId'].clearValidators(); this.applicantService.ProfessionalQualificationForm.controls['courseId'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['otherInstituteName'].setValidators(Validators.required); this.applicantService.ProfessionalQualificationForm.controls['otherInstituteName'].updateValueAndValidity();
        this.applicantService.ProfessionalQualificationForm.controls['otherCourseName'].setValidators(Validators.required); this.applicantService.ProfessionalQualificationForm.controls['otherCourseName'].updateValueAndValidity();
      }
    }

    onFileChange(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1048) <= 2096){
              
              this.fileObject.fileName = file.name;
              this.fileObject.fileType = file.type;
              this.fileObject.fileSize = file.size;
              this.fileObject.fileData = (<string>reader.result).split(',')[1];  
              this.applicantService.ProfessionalQualificationForm.controls['file'].setValue(this.fileObject.fileData);
              this.applicantService.ProfessionalQualificationForm.controls['fileExtension'].setValue( '' + this.fileObject.fileType.split('/')[1]);
              this.errborder = "0px solid red;"
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.attachmentFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
      
    }

    onSubmit():void{
      this.applicantService.ProfessionalQualificationForm.markAllAsTouched();
      if (this.applicantService.ProfessionalQualificationForm.valid) {
        if(this.data.operation === 'Insert'){ //insert 
           this.spinner.show();
           let qualification:any = this.applicantService.ProfessionalQualificationForm.value;
           qualification.otherInstituteName ?  qualification.otherInstituteName.toUpperCase(): null;
           qualification.otherCourseName ? qualification.otherCourseName.toUpperCase() : null;
           console.log(qualification);
           this.applicantService.addProfessionallQualifications(qualification).subscribe(result=> {
            this.spinner.hide();
            this.openSnackBar("professional qualification has been added successfully..", "success-snackbar");
            this.matDialogRef.close({'status': 'success'});

           },errorResponse=>{
            this.spinner.hide();
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        });
        }
      }
      else{
        this.errborder = "1px solid red;"
        const invalid = [];
        const controls = this.applicantService.ProfessionalQualificationForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);
      }
  
    }

    valueChanged():void{
      console.log('value changed')
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


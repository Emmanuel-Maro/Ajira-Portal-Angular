
import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, Optional } from "@angular/core";
import { MatDialogRef, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogService } from "../../shared/service/dialog.service";
import { ApplicantService } from "../service/applicant.service";

@Component({
	templateUrl: './lost-academic-certificate-dialog-form.html',
	styleUrls: ['./lost-academic-certificate-dialog-form.css']
})

export class LostAcademicCertificateDialogForm implements OnInit {
  educationLevel: string = '';
  programmeId:number;
  years: any[] =[];
  nectaResult:any ;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(public applicantService: ApplicantService, private changeDetectorRef: ChangeDetectorRef,public matDialogRef: MatDialogRef<LostAcademicCertificateDialogForm>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private spinner: NgxSpinnerService, private dialogService: DialogService){
    console.log(this.data)
    let currentYear = new Date().getFullYear();
    for(var i=1; i<=60; i++){
        this.years.push({'year': currentYear--});
    }
    console.log(this.data);
  }

  ngOnInit(): void { 
    this.applicantService.LostAcademicCertificateForm.reset();
    if(this.data){
      this.applicantService.LostAcademicCertificateForm.controls['level'].setValue(this.data.educationLevel);
      switch(this.data.educationLevel){
        case 8 :   this.educationLevel = 'Advanced Level (ACSE)'; this.changeDetectorRef.detectChanges(); break;
        case 9 :   this.educationLevel = 'Ordinary Level (CSE)'; this.changeDetectorRef.detectChanges(); break;
      }
      console.log(this.nectaResult)
    }
  }  

  onStartTyping(event:any):void{
    this.applicantService.LostAcademicCertificateForm.controls['indexNumber'].setValue(event.target.value.toUpperCase());
  }

  onSubmit():void{
    this.applicantService.LostAcademicCertificateForm.markAllAsTouched();
    if (this.applicantService.LostAcademicCertificateForm.valid) {
      console.log(this.applicantService.LostAcademicCertificateForm.value);
      this.applicantService.lostAcademicCertificate(this.applicantService.LostAcademicCertificateForm.value).subscribe(result =>{
        this.nectaResult = JSON.parse(result.data);
        this.nectaResult.yearFrom = (this.data.educationLevel == 8) ? this.applicantService.LostAcademicCertificateForm.controls['year'].value - 1 : this.applicantService.LostAcademicCertificateForm.controls['year'].value - 3,
        this.nectaResult.yearTo = this.applicantService.LostAcademicCertificateForm.controls['year'].value
        this.matDialogRef.close(this.nectaResult);
      },errorResponse=> {
              this.spinner.hide();
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
                this.matDialogRef.close();
              } 
            });
    }
  }

  /*
  postAcademicDetails(): void{
    let academic = 
    {
      "countryId": 1,
      "division": this.nectaResult.results.division.division,
      "divisionPoints": this.nectaResult.results.division.points,
      "gpaPoints": null,
      "gpaTotal": null,
      "indexNumber": this.nectaResult.particulars.index_number,
      "institutionId": null,
      "levelId": this.data.educationLevel,
      "merit": null,
      "otherCountryName": null,
      "otherInstitutionName": this.nectaResult.particulars.center_name,
      "otherProgrammeName": null,
      "otherQualificationLevel": null,
      "programmeCategotyId": null,
      "programmeId": this.data.programmeId,
      "yearFrom": (this.data.educationLevel == 8) ? this.applicantService.LostAcademicCertificateForm.controls['year'].value - 1 : this.applicantService.LostAcademicCertificateForm.controls['year'].value - 3,
      "yearTo": this.applicantService.LostAcademicCertificateForm.controls['year'].value
    }
    
    this.applicantService.addAcademicQualifications(academic).subscribe(result=>{
      this.matDialogRef.close({'status': "success"});

    },errorResponse=> {
      this.spinner.hide();
      console.log(errorResponse);
      if(errorResponse && errorResponse.message)
        this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
      else {
        this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
        this.matDialogRef.close();
      } 
    });

  }
  */

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

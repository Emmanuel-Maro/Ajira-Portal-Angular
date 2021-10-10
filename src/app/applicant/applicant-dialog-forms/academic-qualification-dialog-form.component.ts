
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { LostAcademicCertificateDialogForm } from "./lost-academic-certificate-dialog-form";
import { environment } from "../../../environments/environment";
import { Validators } from "@angular/forms";

@Component({
    templateUrl: './academic-qualification-dialog-form.component.html',
    styleUrls: ['./academic-qualification-dialog-form.component.css']
  })

  export class AcademicQualificationDialogForm implements OnInit {
    @ViewChild('certificateFile') certificateFile: ElementRef;
    @ViewChild('transcriptFile') transcriptFile: ElementRef;
    @ViewChild('tcuCertificateFile') tcuCertificateFile: ElementRef;
    @ViewChild('nectaCertificateFile') nectaCertificateFile: ElementRef;
    @ViewChild('nacteCertificateFile') nacteCertificateFile: ElementRef;
    nectaResult:any ;
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    divisionSection:string = 'Division';
    divisions:any[] = [{'division':'I'}, {'division':'II'}, {'division':'III'},{'division':'IV'}, {'division':'0'}];
    points:any[] = [];
    points_:any[] = [];
    
  csee_points:any[]=[{'point':7, 'division': 'I' },{'point':8, 'division': 'I'  },{'point':9,'division': 'I' },{'point':10 ,'division': 'I' }, 
                    {'point':11,'division': 'I'}, {'point':12,'division': 'I'}, {'point':13,'division': 'I'}, {'point':14,'division': 'I'},
                    {'point':15,'division': 'I'},{'point':16,'division': 'I'},{'point':17,'division': 'I'},{'point':18,'division': 'II'},
                    {'point':19,'division': 'II'},{'point':20,'division': 'II'},{'point':21,'division': 'II'},{'point':22, 'division': 'III'},
                    {'point':23,'division': 'III'},{'point':24,'division': 'III' },{'point':25,'division': 'III'},{'point':26,'division': 'IV'},
                    {'point':27, 'division': 'IV' },{'point':28,'division': 'IV' },{'point':29, 'division': 'IV'},{'point':30, 'division': 'IV'},
                    {'point':31,'division': 'IV' },{'point':32,'division': 'IV' },{'point':33,'division': 'IV'},{'point':34,'division': '0' },
                    {'point':35, 'division': '0'}];

  acsee_points:any[] = [{'point':3, 'division': 'I' },{'point':4, 'division': 'I' },{'point':5, 'division': 'I' },{'point':6, 'division': 'I' },
                    {'point':7, 'division': 'I' },{'point':8, 'division': 'I' },{'point':9,'division': 'I' },{'point':10,'division': 'II' }, 
                    {'point':11, 'division': 'II'}, {'point':12, 'division': 'II'}, {'point':13, 'division': 'III' }, {'point':14, 'division': 'III' },
                    {'point':15, 'division': 'III' },{'point':16, 'division': 'III' },{'point':17,'division': 'III'},{'point':18, 'division': 'IV'},
                    {'point':19, 'division': 'IV'},{'point':20, 'division': '0'},{'point':21, 'division': '0'}];


    meritValues:any[] = [{'value':'Distinction'}, {'value':'Merit'}, {'value':'Pass'}];
    educationLevels:any[] = [];
    selectedProgrammeCategory:any ;

    programmeNames:any[] = [];
    academicInstitutions:any[] = [];
    instituteName:string;
    programmeCategories:any = [];

    countries:any[] = [];
    displayedColumns:string[] = [];
    hasEquivalanceNumber:boolean = false;
    isCertificateShown:boolean = false;
    isTranscriptShown:boolean = false;
    isTCUCertificateShown:boolean = false;
    isNECTAShown:boolean = false;
    isNACTEShown:boolean = false;
    years: any[] =[];
    yearsFrom: any[] =[];
    yearsTo: any[] =[];

    base64Certificate:any;
    base64Transcript:any;
    base64Tcu:any;
    base64Nacte:any;
    base64Necta:any;

    certificateErrorBorder:string ;
    transcriptErrorBorder:string ;
    tcuErrorBorder:string ;
    nacteErrorBorder:string ;
    nectaErrorBorder:string ;


    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, 
      public matDialogRef: MatDialogRef<AcademicQualificationDialogForm>, private changeDetectorRef:ChangeDetectorRef, private snackBar: MatSnackBar,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){
          this.applicantService.academicLevels().subscribe(result=>{ 
            this.educationLevels = result.data; 
          },errorResponse=>{
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            }
        });

        this.applicantService.countries().subscribe(result=>{ 
          this.countries = result.data;
         // let selectedCountry =  _.find(this.countries, {phonecode: 255}); 
          //this.applicantService.AcademicQualificationForm.controls['countryId'].setValue(selectedCountry.id);
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "");
            this.matDialogRef.close();
          } 
      });

      this.applicantService.academicInstituions().subscribe(result=>{
        this.academicInstitutions = result.data;
        
       
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

    ngOnInit(): void {  console.log(this.data.dialogData)
      this.displayedColumns = ['attachmentType', 'actions' ]; 
      this.applicantService.AcademicQualificationForm.reset();
      this.setYears();
      if(this.data && this.data.operation == 'Update'){ 
        this.populateDialogData(this.data.dialogData);
        this.onSelectedEducationLevel();
        this.onCountrySelect();
      }
      
    }

    //populate data onEdit
    populateDialogData(data):void{ 
      this.applicantService.AcademicQualificationForm.controls['levelId'].setValue(data.levelId);
      this.applicantService.AcademicQualificationForm.controls['programmeId'].setValue(data.programmeId);
      this.applicantService.AcademicQualificationForm.controls['programmeCategoryId'].setValue(data.programmeCategoryId);
      this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].setValue(data.institutionNameOther);
      //this.applicantService.AcademicQualificationForm.controls['otherProgrammeName'].setValue(data.otherProgrammeName);
      this.applicantService.AcademicQualificationForm.controls['institutionId'].setValue(data.institutionId);
      this.applicantService.AcademicQualificationForm.controls['yearFrom'].setValue( new Date(data.dateFrom).getFullYear());
      this.applicantService.AcademicQualificationForm.controls['yearTo'].setValue( new Date(data.dateTo).getFullYear());
      this.applicantService.AcademicQualificationForm.controls['gpaPoints'].setValue(data.gpaPoints);
      this.applicantService.AcademicQualificationForm.controls['gpaTotal'].setValue(data.gpaTotal);
      this.applicantService.AcademicQualificationForm.controls['indexNumber'].setValue(data.indexNumber);
      this.applicantService.AcademicQualificationForm.controls['division'].setValue(data.division);
      this.applicantService.AcademicQualificationForm.controls['divisionPoints'].setValue(data.divisionPoints);
      this.applicantService.AcademicQualificationForm.controls['meritValue'].setValue(data.meritValue);
      this.applicantService.AcademicQualificationForm.controls['equivalanceNumber'].setValue(data.equivalanceNumber);
      this.applicantService.AcademicQualificationForm.controls['countryId'].setValue(data.countryId);
    }

    setYears():void{
      let currentYear = new Date().getFullYear();
      for(var i=1; i<=60; i++){
        this.years.push({'year': currentYear--});
      }
      this.yearsFrom = this.years;
      this.yearsTo = this.years;
    }

    onProgrammeChange():void { 
        this.selectedProgrammeCategory =  _.find(this.programmeNames, {'id': this.applicantService.AcademicQualificationForm.controls['programmeId'].value}); 
        this.applicantService.AcademicQualificationForm.controls['programmeCategoryId'].setValue(this.selectedProgrammeCategory.categoryId);
    }

    onSelectedEducationLevel():void {
      this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].setValue('');
      this.applicantService.AcademicQualificationForm.controls['programmeId'].setValue(null);
      this.applicantService.AcademicQualificationForm.controls['programmeCategoryId'].setValue(null);
      this.selectedProgrammeCategory = null;
      if(this.applicantService.AcademicQualificationForm.controls['countryId'].value){ 
        this.onCountrySelect();
      }
      this.applicantService.AcademicQualificationForm.controls['divisionPoints'].setValue(null);
      this.applicantService.AcademicQualificationForm.controls['division'].setValue(null);
      if(this.applicantService.AcademicQualificationForm.controls['levelId'].value == 8){
        this.points_ = [...this.acsee_points];
      }
      else  if(this.applicantService.AcademicQualificationForm.controls['levelId'].value == 9){
        this.points_ = [...this.csee_points];
      }

      this.applicantService.academicProgrammes(this.applicantService.AcademicQualificationForm.controls['levelId'].value).subscribe(result=>{ 
        this.programmeNames = result.data || []; 
        this.programmeCategories = result.data || [];
        console.log(this.programmeNames);
        if(this.programmeNames.length === 1){
          this.applicantService.AcademicQualificationForm.controls['programmeId'].setValue(this.programmeNames[0].id);
          this.onProgrammeChange();
          this.changeDetectorRef.detectChanges();
        }
      },errorResponse=>{
        console.log(errorResponse);
        if(errorResponse && errorResponse.message)
          this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
        else {
          this.openSnackBar("an error occurred while trying to fetch data from remote server", "warning-snackbar");
        } 
      });
    }

    onDivisionSelect():void {
      this.applicantService.AcademicQualificationForm.controls['divisionPoints'].setValue(null);
      this.points = this.points_.filter(item => item.division === this.applicantService.AcademicQualificationForm.controls['division'].value);
    }

    onCountrySelect():void {
      this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].setValue('');
      if(this.applicantService.AcademicQualificationForm.controls['countryId'].value === 1){ 
        this.applicantService.AcademicQualificationForm.controls['institutionId'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['institutionId'].updateValueAndValidity();
        this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].updateValueAndValidity();
       
         if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 8 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 9 )
         {
          this.applicantService.AcademicQualificationForm.controls['institutionId'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['institutionId'].updateValueAndValidity();
          
           if(this.divisionSection === 'Division'){
              this.applicantService.AcademicQualificationForm.controls['indexNumber'].setValidators([Validators.required, Validators.pattern("^(S|P)[0-9]{4}-[0-9]{4}$")]); this.applicantService.AcademicQualificationForm.controls['indexNumber'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['division'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['divisionPoints'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['meritValue'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
           }
           else  if(this.divisionSection === 'Merit'){
              this.applicantService.AcademicQualificationForm.controls['meritValue'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['indexNumber'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['indexNumber'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['division'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['divisionPoints'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
           }

            this.isNECTAShown = false; this.isNACTEShown = false; this.isTCUCertificateShown = false; this.isTranscriptShown=false;
            this.isCertificateShown=true;
         }
         else if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 6 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 7 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 10 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 11 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 12)
        {
         this.isNECTAShown = false; this.isNACTEShown = false;  this.isTCUCertificateShown = false;
         this.isTranscriptShown=true; this.isCertificateShown=true;
         
        } 
        else if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 1 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 2 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 3 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 4 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 5)
        { 
          this.isNECTAShown = false; this.isNACTEShown = false;  this.isTCUCertificateShown = false;
           this.isTranscriptShown=true; this.isCertificateShown=true;
        } 

        if(this.applicantService.AcademicQualificationForm.controls['levelId'].value !== 8 && this.applicantService.AcademicQualificationForm.controls['levelId'].value !== 9 ){
              this.applicantService.AcademicQualificationForm.controls['indexNumber'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['indexNumber'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['division'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['divisionPoints'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['meritValue'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
        }
      }
      else { 
              this.applicantService.AcademicQualificationForm.controls['indexNumber'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['indexNumber'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['division'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['divisionPoints'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
              this.applicantService.AcademicQualificationForm.controls['meritValue'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
          
              
              this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['otherInstitutionName'].updateValueAndValidity();
              if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 8 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 9 ){ 
                this.applicantService.AcademicQualificationForm.controls['institutionId'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['institutionId'].updateValueAndValidity();
                 this.isNACTEShown = false; this.isTCUCertificateShown = false;this.isTranscriptShown=false;
                 this.isCertificateShown=true; this.isNECTAShown = true;
              }
              else if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 6 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 7 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 10 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 11 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 12)
              {
               this.isNACTEShown = true; this.isTranscriptShown=true; this.isCertificateShown=true;
              this.isTCUCertificateShown = false; this.isNECTAShown = false;
              } 
              else if(this.applicantService.AcademicQualificationForm.controls['levelId'].value === 1 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 2 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 3 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 4 || this.applicantService.AcademicQualificationForm.controls['levelId'].value === 5)
              { 
                  this.isNECTAShown = false; this.isNACTEShown = false;  
                  this.isTCUCertificateShown = true; this.isTranscriptShown=true; this.isCertificateShown=true;
              } 
        }
      
    }

    onStartTyping(event:any):void{
      this.applicantService.AcademicQualificationForm.controls['indexNumber'].setValue(event.target.value.toUpperCase());
    }

    onEquivalanceNumberTyping(event:any):void{
      this.applicantService.AcademicQualificationForm.controls['equivalanceNumber'].setValue(event.target.value.toUpperCase());
    }

    radioChange(event:any):void{
      console.log(event.source.value);
      if(this.divisionSection === 'Division'){
        this.applicantService.AcademicQualificationForm.controls['division'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
        this.applicantService.AcademicQualificationForm.controls['divisionPoints'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
        this.applicantService.AcademicQualificationForm.controls['meritValue'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
     }
     else  if(this.divisionSection === 'Merit'){
        this.applicantService.AcademicQualificationForm.controls['meritValue'].setValidators(Validators.required); this.applicantService.AcademicQualificationForm.controls['meritValue'].updateValueAndValidity();
        this.applicantService.AcademicQualificationForm.controls['division'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['division'].updateValueAndValidity();
        this.applicantService.AcademicQualificationForm.controls['divisionPoints'].clearValidators(); this.applicantService.AcademicQualificationForm.controls['divisionPoints'].updateValueAndValidity();
     }

    }

    onLostAcademicCertificate():void{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      //dialogConfig.height="50%";
      dialogConfig.data = {'operation': 'Insert', 'educationLevel': this.applicantService.AcademicQualificationForm.controls['levelId'].value, 
      'programmeId' :  this.applicantService.AcademicQualificationForm.controls['programmeId'].value };
      this.dialog.open(LostAcademicCertificateDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{ 
          if(dialogData){
            this.nectaResult = dialogData;
            console.log(this.nectaResult);
            this.changeDetectorRef.detectChanges();
          }
      });
    }

    onYearFromSelect():void{
      let selectedYear= this.applicantService.AcademicQualificationForm.controls['yearFrom'].value;
      let index =  _.findIndex(this.years, {'year':selectedYear}); console.log(index);
      this.yearsTo = [];
      for(var i = 0; i< index + 1; i++){
        this.yearsTo.push(this.years[i]);
      }
     // this.yearsTo = this.years.splice(-index);

    }

    onYearToSelect():void{
      let selectedYear= this.applicantService.AcademicQualificationForm.controls['yearTo'].value;
      let index =  _.findIndex(this.years, {'year':selectedYear}); console.log(index);
      this.yearsFrom = []; 
      for(var i = index; i < this.years.length; i++){ 
        this.yearsFrom.push(this.years[i]);
      }
    }

    onCertificateAttach(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){ 
            if(file.type.indexOf('application/pdf') == 0){
              this.base64Certificate = {
                'fileType':file.type.split('/')[1],
                'content': (<string>reader.result).split(',')[1]
              };
              this.certificateErrorBorder = "0px solid red;"
            }
            else{
              this.dialogService.openAlertDialog("Warning","only pdf files can be uploaded!", "warning");
              this.certificateFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.certificateFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }

    onTranscriptAttach(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){
            if(file.type.indexOf('application/pdf') == 0){
              this.base64Transcript = {
                'fileType':file.type.split('/')[1],
                'content': (<string>reader.result).split(',')[1]
              };
              this.transcriptErrorBorder = "0px solid red;";
            }
            else{
              this.dialogService.openAlertDialog("Warning","only pdf files can be uploaded!", "warning");
              this.transcriptFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.certificateFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }

    onTCUCertificateAttach(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){
            if(file.type.indexOf('application/pdf') == 0){
              this.base64Tcu = {
                'fileType':file.type.split('/')[1],
                'content': (<string>reader.result).split(',')[1]
              };

              this.tcuErrorBorder = "0px solid red;";
            }
            else{
              this.dialogService.openAlertDialog("Warning","only pdf files can be uploaded!", "warning");
              this.tcuCertificateFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.certificateFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }

    onNACTECertificateAttach(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){
            if(file.type.indexOf('application/pdf') == 0){
              this.base64Tcu = {
                'fileType':file.type.split('/')[1],
                'content': (<string>reader.result).split(',')[1]
              };
              this.nacteErrorBorder = "0px solid red;";
            }
            else{
              this.dialogService.openAlertDialog("Warning","only pdf files can be uploaded!", "warning");
              this.nacteCertificateFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.certificateFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }

    onNECTACertificateAttach(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 2048){
            if(file.type.indexOf('application/pdf') == 0){
              this.base64Tcu = {
                'fileType':file.type.split('/')[1],
                'content': (<string>reader.result).split(',')[1]
              };
              this.nectaErrorBorder = "0px solid red;";
            }
            else{
              this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
              this.nectaCertificateFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.certificateFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }
    

    onSubmit():void{ 
      this.applicantService.AcademicQualificationForm.markAllAsTouched();
      if (this.applicantService.AcademicQualificationForm.valid) { 
        let academic = this.applicantService.AcademicQualificationForm.value;
        if(this.data && this.data.operation == 'Insert'){
  
          academic.base64Certificate =  this.base64Certificate;
          academic.base64Transcript = this.base64Transcript;
          academic.base64Tcu = this.base64Tcu;
  
          this.spinner.show();
          academic.academicId = this.data.id;
          this.applicantService.addAcademicQualifications(academic).subscribe(result=> { 
            this.spinner.hide();
            this.matDialogRef.close(result);
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
        else { //Update
          academic.base64Certificate =  this.base64Certificate;
          academic.base64Transcript = this.base64Transcript;
          academic.base64Tcu = this.base64Tcu;
          this.spinner.show();
          academic.academicId = this.data.dialogData.id;
          this.applicantService.updateAcademicQualifications(academic).subscribe(result=> { 
            this.spinner.hide();
            this.matDialogRef.close(result);
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
      /*else{
        if(!this.base64Certificate || !this.base64Certificate.fileType)  this.certificateErrorBorder = "1px solid red;"; 
        if(!this.base64Transcript || !this.base64Transcript.fileType)  this.transcriptErrorBorder = "1px solid red;"
        if(!this.base64Tcu || !this.base64Tcu.fileType)  this.tcuErrorBorder = "1px solid red;";
        if(!this.base64Nacte || !this.base64Nacte.fileType)  this.nacteErrorBorder = "1px solid red;"
        if(!this.base64Necta || !this.base64Necta.fileType)  this.nectaErrorBorder = "1px solid red;";

        const invalid = [];
        const controls = this.applicantService.AcademicQualificationForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);
      }*/
    }

 

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
        "levelId": this.applicantService.AcademicQualificationForm.controls['levelId'].value,
        "merit": null,
        "otherCountryName": null,
        "otherInstitutionName": this.nectaResult.particulars.center_name,
        "otherProgrammeName": null,
        "otherQualificationLevel": null,
        "programmeCategotyId": null,
        "programmeId": this.applicantService.AcademicQualificationForm.controls['programmeId'].value,
        "yearFrom": this.nectaResult.yearFrom,
        "yearTo": this.nectaResult.yearTo 
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

    onClose(){;
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


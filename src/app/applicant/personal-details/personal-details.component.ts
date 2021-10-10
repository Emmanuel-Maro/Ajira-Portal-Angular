import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { OtherPersonalDetailsDialogFormComponent } from "../applicant-dialog-forms/other-personal-details-dialog-form.component";
import { ContactDetailsDialogFormComponent } from "../applicant-dialog-forms/contanct-details-dialog-form.component";
import { NidaQuestionsDialogForm } from "../applicant-dialog-forms/nida-questions-dialog-form.component";
import { Validators } from "@angular/forms";
import { NgIdleService } from "../service/ng-idle.service";
import { AuthService } from "../../shared/service/auth.service";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
    templateUrl: './personal-details.component.html',
    styleUrls: ['./personal-details.component.css'],
    providers: [NgIdleService]
  })

  export class PersonalDetailsComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;
    personalDetails:any = {} ;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    nationalID:string;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    countries:any = [];
    selectedCountry:any = {};
    presentAddress:string = '';
    regions:any = []
    districts:any = [];
    isQnStarted:boolean = false;
    /***************** */
    nin:string;
    rqCode:string;
    questionEn:string;
    questionSw:string;
    qnAnsw:string;
    applicantAnswers: string[] = [];
    /**************** */
    firstLevelTimer:number = environment.FIRST_LEVEL_TIMER;
    secondLevelTimer:number = environment.SECOND_LEVEL_TIMER;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;

      constructor(public applicantService: ApplicantService,  private dialog: MatDialog, private snackBar: MatSnackBar,private ngIdle: NgIdleService, private router:Router,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private authService: AuthService, private spinner: NgxSpinnerService){
 
        this.getPersonalDetails();
        this.getContactDetails();
      }

      ngOnInit(): void {    
       this.applicantService.NidaInfoRequestForm.reset();
       this.applicantService.ContactDetailsForm.reset();
       this.displayedColumns = ['countryName', 'currentResidentRegion', 'mobileNumber', 'alternativeEmail', 'presentAddress', 'actions'];

      }

      ngOnDestroy(): void {

      }

      getPersonalDetails():void{
        this.spinner.show();
          this.applicantService.getPersonalDetails().subscribe(result => { 
            this.spinner.hide();
            this.personalDetails = result.data;
            this.changeDetectorRef.detectChanges();
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

      getCountries():void {
        this.applicantService.countries().subscribe(result=>{ 
          this.countries = result.data;
         
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "");
          } 
      });
      }

      getContactDetails():void{
        this.applicantService.contactDetails().subscribe(result => { 
          this.dataSource.data = result.data; 
          this.dataSource._updateChangeSubscription();
          this.changeDetectorRef.detectChanges();
          if(this.dataSource.data[0] && !this.dataSource.data[0].countryResidence && !this.dataSource.data[0].mobileNumber){
            this.getCountries();
          }

        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
      });
      }

      omitChar(event): boolean{
        let k = event.charCode;
        return (k >= 48 && k <= 57);  // 48 <= k <= 57 (allow only integers between 0 and 9)
      }

     
      onPreview(row:any):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'attachmentType': row.AttachmentType, 'fileData': row.fileData};
        this.dialog.open(AttachmentPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
         
        });
      }


      onInsertContactDetails():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(ContactDetailsDialogFormComponent, dialogConfig).afterClosed().subscribe(formData =>{ 
            if(formData){
              this.getContactDetails();
            }
        });
      }

      onEdit():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "72%";
        //dialogConfig.height="50%";
        dialogConfig.data = {'originality': this.personalDetails.originality };
        this.dialog.open(OtherPersonalDetailsDialogFormComponent, dialogConfig).afterClosed().subscribe(formData =>{ 
                  if(formData){
                    this.personalDetails.physicalDisability = formData.physicalDisability;
                    this.personalDetails.originality = formData.originality;
                    this.personalDetails.inService = formData.inService;
                    this.personalDetails.maritalStatus = formData.maritalStatus;
                    this.changeDetectorRef.detectChanges();
                  }
        });
      }

      onEditContactDetails(row:any):void{ 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "72%";
        dialogConfig.data = {'dialogData': row, 'operation': 'Edit'};
        this.dialog.open(ContactDetailsDialogFormComponent, dialogConfig).afterClosed().subscribe(formData =>{ 
            if(formData){
              this.getContactDetails();
            }
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

      translateMaritalStatus(statusId:number): string{
        switch(statusId){
          case 0: return 'Single';
          case 1: return 'Married'
          default: return '';
        }
      }

      translateEmploymentStatus(statusId:number): string{ 
        switch(statusId){
          case 1: return 'Yes';
          case 0: return 'No'
          default: return '';
        }
      }

      translateDisability(statusId:number): string{
        switch(statusId){
          case 0: return 'Not Applicable';
          case 1: return 'Visual';
          case 2: return 'Physical';
          default: return '';
        }
      }

      ninQuestions():void{
        let request = {'nin': this.applicantService.NidaInfoRequestForm.controls['nin'].value };
        this.spinner.show();
        this.applicantService.ninQuestions(request).subscribe((result:any) => {
          this.spinner.hide();
          this.nin = this.applicantService.NidaInfoRequestForm.controls['nin'].value;
          this.rqCode = result.data.rqCode;
          this.questionEn = result.data.qnEn;
          this.questionSw = result.data.qnSw;
          this.isQnStarted = true;

          /*const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.data = {'nin': this.applicantService.NidaInfoRequestForm.controls['nin'].value, 'dialogData': result.data };
            this.dialog.open(NidaQuestionsDialogForm, dialogConfig).afterClosed().subscribe(details =>{
              if(details){ 
                this.personalDetails = details;
                this.changeDetectorRef.detectChanges();
              }
            });*/
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

      updateNIN():void{
        let request = {'nin': this.personalDetails.nin }; 
        this.spinner.show();
        this.applicantService.ninQuestions(request).subscribe((result:any) => {
          this.spinner.hide();
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.width = "75%";
          dialogConfig.data = {'nin': this.personalDetails.nin, 'dialogData': result.data };
            this.dialog.open(NidaQuestionsDialogForm, dialogConfig).afterClosed().subscribe(details =>{
              if(details){ 
                this.personalDetails = details;
                this.changeDetectorRef.detectChanges();
              }
            });
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

      onCountrySelect():void{ 
        if(this.applicantService.ContactDetailsForm.controls['countryResidence'].value === 1){
          this.applicantService.ContactDetailsForm.controls['stateCity'].setValue(null);
          this.applicantService.ContactDetailsForm.controls['countyProvince'].setValue(null);

          this.applicantService.ContactDetailsForm.controls['region'].setValidators(Validators.required); this.applicantService.ContactDetailsForm.controls['region'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['district'].setValidators(Validators.required); this.applicantService.ContactDetailsForm.controls['district'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['boxNo'].setValidators(Validators.required); this.applicantService.ContactDetailsForm.controls['boxNo'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['stateCity'].clearValidators(); this.applicantService.ContactDetailsForm.controls['stateCity'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['countyProvince'].clearValidators(); this.applicantService.ContactDetailsForm.controls['countyProvince'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['presentAddress'].clearValidators(); this.applicantService.ContactDetailsForm.controls['presentAddress'].updateValueAndValidity();

          this.applicantService.getRegions().subscribe(result=>{ 
             this.regions = result.data;
          })
        }
        else{
          this.applicantService.ContactDetailsForm.controls['district'].setValue(null);
          this.applicantService.ContactDetailsForm.controls['region'].setValue(null);

          this.applicantService.ContactDetailsForm.controls['stateCity'].setValidators(Validators.required);this.applicantService.ContactDetailsForm.controls['stateCity'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['countyProvince'].setValidators(Validators.required); this.applicantService.ContactDetailsForm.controls['countyProvince'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['presentAddress'].setValidators(Validators.required); this.applicantService.ContactDetailsForm.controls['presentAddress'].updateValueAndValidity();
          
          this.applicantService.ContactDetailsForm.controls['region'].clearValidators(); this.applicantService.ContactDetailsForm.controls['region'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['district'].clearValidators();this.applicantService.ContactDetailsForm.controls['district'].updateValueAndValidity();
          this.applicantService.ContactDetailsForm.controls['boxNo'].clearValidators(); this.applicantService.ContactDetailsForm.controls['boxNo'].updateValueAndValidity();

        }
      }

      onRegionSelect():void { 
          
          this.applicantService.getDistricts(this.applicantService.ContactDetailsForm.controls['region'].value).subscribe(result=>{ 
            this.districts = result.data; 
          })
        
      }

      onBoxNumberChange(){
        if(!this.applicantService.ContactDetailsForm.get('boxNo').value || this.applicantService.ContactDetailsForm.get('boxNo').value < 1){
          this.applicantService.ContactDetailsForm.get('boxNo').setValue('');
        }
      }


      addContactDetails():void{ 
        this.applicantService.ContactDetailsForm.markAllAsTouched();
        if(this.applicantService.ContactDetailsForm.valid){
          let contactAddress = this.applicantService.ContactDetailsForm.value;
          contactAddress.contactAddressId = this.dataSource.data[0].contactAddressId;
              if(this.applicantService.ContactDetailsForm.controls['countryResidence'].value === 1){ 
                let region =  _.find(this.regions, {regionId: this.applicantService.ContactDetailsForm.controls['region'].value});
                let district =  _.find(this.districts, {districtId: this.applicantService.ContactDetailsForm.controls['district'].value});
                contactAddress.presentAddress = 'P.O Box '  + this.applicantService.ContactDetailsForm.controls['boxNo'].value + ', ' +  district.districtName + ', ' + region.regionName 
              }
              else contactAddress.presentAddress = this.presentAddress;
                this.applicantService.updateContactDetails(contactAddress).subscribe(result=>{ 
                  this.getContactDetails();
                },errorResponse=>{
                  console.log(errorResponse);
                  if(errorResponse && errorResponse.message)
                    this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
                  else {
                    this.openSnackBar("an error occurred when try to fetch data from remote server", "");
                  } 
              });
          

        }
        
      }

      
    onSubmit():void {
      let request = {
        "nin": this.nin,
        "qnAnsw": this.qnAnsw,
        "rqCode": this.rqCode
      };
      this.spinner.show();
      this.applicantService.ninQuestions(request).subscribe((result:any) => {
        this.spinner.hide();
        if(result.statusCode === 2512 || result.statusCode === 2507){
          this.dialogService.openAlertDialog("Error", "You have reached maximum number of attempts", "error");
          this.qnAnsw = '';this.questionEn = ''; this.questionSw = '';
          this.rqCode = ''; this.applicantAnswers = []; this.isQnStarted = false;
          this.changeDetectorRef.detectChanges();
        }
        else  if(result.statusCode === 2505){
          this.openOtherPersonalDetailsDialogForm();
          this.isQnStarted = false;
        }
        else{
          this.qnAnsw = '';
          this.applicantAnswers.push(result.data.preQnAnsw);
          this.questionEn = result.data.qnEn;
          this.questionSw = result.data.qnSw;
          this.rqCode = result.data.rqCode;
          this.changeDetectorRef.detectChanges();
        }

      },errorResponse=>{ this.spinner.hide();
        console.log(errorResponse);
        if(errorResponse && errorResponse.message)
          this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
        else {
          this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
        } 
      });
    }

    openOtherPersonalDetailsDialogForm():void{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "72%";
      this.dialog.open(OtherPersonalDetailsDialogFormComponent, dialogConfig).afterClosed().subscribe(formData =>{ 
        this.getPersonalDetails();
        this.getContactDetails();
       
        this.changeDetectorRef.detectChanges();
      });
    }

  }
  
  
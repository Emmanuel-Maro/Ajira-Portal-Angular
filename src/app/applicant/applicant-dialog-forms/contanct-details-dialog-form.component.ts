
import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef, Optional, Inject } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DIALOG_DATA} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { RefereeDialogForm } from "../applicant-dialog-forms/referee-dialog-form.component";
import { environment } from "../../../environments/environment";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { Validators } from "@angular/forms";

@Component({
    templateUrl: './contanct-details-dialog-form.component.html',
    styleUrls: ['./contanct-details-dialog-form.component.css']
  })

  export class ContactDetailsDialogFormComponent implements OnInit {
    countries:any = [];
    selectedCountry:any = {};
    presentAddress:string = '';
    regions:any = []
    districts:any = [];
    loading:boolean = true;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
   
      constructor(public applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,@Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        public matDialogRef: MatDialogRef<ContactDetailsDialogFormComponent>, private dialogService: DialogService, private changeDetectorRef:ChangeDetectorRef, private spinner: NgxSpinnerService){
          this.getCountries();
      }

      ngOnInit(): void {    
       this.applicantService.ContactDetailsForm.reset();
       if(this.data && this.data.dialogData){
        this.populateDialogData(this.data.dialogData);
       }

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
            this.matDialogRef.close();
          } 
      });
      }
      //populate data onEdit
    populateDialogData(data):void{  console.log(data);
      //this.applicantService.ContactDetailsForm.controls['contactAddressId'].setValue(data.contactAddressId);
      this.applicantService.ContactDetailsForm.controls['region'].setValue(data.region);
      this.applicantService.ContactDetailsForm.controls['district'].setValue(data.district);
      this.applicantService.ContactDetailsForm.controls['alternativeEmail'].setValue(data.alternativeEmail);
      this.applicantService.ContactDetailsForm.controls['countryResidence'].setValue(+data.countryResidence);
      this.applicantService.ContactDetailsForm.controls['stateCity'].setValue(data.stateCity);
      this.applicantService.ContactDetailsForm.controls['mobileNumber'].setValue(data.mobileNumber);
      this.applicantService.ContactDetailsForm.controls['countyProvince'].setValue(data.countryProvince);
      this.changeDetectorRef.detectChanges();
      

      let presentAddress = data.presentAddress || '';
      let address_parts = presentAddress.toUpperCase().split(',');
      if(address_parts.length > 0){
        let boxNumber = address_parts[0].replace('P.O BOX', '').trim() || '';
        this.applicantService.ContactDetailsForm.controls['boxNo'].setValue(boxNumber);
      }

      this.onCountrySelect();
      this.onRegionSelect();
      this.changeDetectorRef.detectChanges();

    }

      onCountrySelect():void{ 
        //this.applicantService.ContactDetailsForm.controls['stateCity'].setValue(null);
        //this.applicantService.ContactDetailsForm.controls['countyProvince'].setValue(null);
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
        if(this.applicantService.ContactDetailsForm.controls['countryResidence'].value === 1){
          this.applicantService.getDistricts(this.applicantService.ContactDetailsForm.controls['region'].value).subscribe(result=>{ console.log(result);
            this.districts = result.data; 
          });
        }
        
      }

      onBoxNumberChange(){
        if(!this.applicantService.ContactDetailsForm.get('boxNo').value || this.applicantService.ContactDetailsForm.get('boxNo').value < 1){
          this.applicantService.ContactDetailsForm.get('boxNo').setValue(1);
        }
      }

      onSubmit():void{  
        this.applicantService.ContactDetailsForm.markAllAsTouched();
        if(this.applicantService.ContactDetailsForm.valid){
          this.spinner.show();
          let contactAddress = this.applicantService.ContactDetailsForm.value;
              contactAddress.contactAddressId = this.data.dialogData.contactAddressId;
              if(this.applicantService.ContactDetailsForm.controls['countryResidence'].value === 1){
                let region =  _.find(this.regions, {regionId: this.applicantService.ContactDetailsForm.controls['region'].value});
                let district =  _.find(this.districts, {districtId: this.applicantService.ContactDetailsForm.controls['district'].value});
                contactAddress.presentAddress = 'P.O Box '  + this.applicantService.ContactDetailsForm.controls['boxNo'].value + ', ' +  district.districtName + ', ' + region.regionName 
              }
              //else contactAddress.presentAddress = this.presentAddress;
          /*if(this.data.operation === 'Insert'){
                this.applicantService.addContactDetails(contactAddress).subscribe(result=>{ console.log(result)
                  this.matDialogRef.close({'status': 'Sucess'});
                },errorResponse=>{
                  console.log(errorResponse);
                  if(errorResponse && errorResponse.message)
                    this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
                  else {
                    this.openSnackBar("an error occurred when try to fetch data from remote server", "");
                    this.matDialogRef.close();
                  } 
              });
          }*/
         // else { //console.log(contactAddress);
             this.applicantService.updateContactDetails(contactAddress).subscribe(result=>{  
               this.spinner.hide();
              this.matDialogRef.close({'status': 'Sucess'});
            },errorResponse=>{
              this.spinner.hide();
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "");
                this.matDialogRef.close();
              } 
            }); 
          //}
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
        this.matDialogRef.close();
      }
      
  }
  
  
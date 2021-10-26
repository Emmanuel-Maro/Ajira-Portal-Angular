
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";
import { NgIdleService } from "../service/ng-idle.service";
import { Router } from "@angular/router";
import { AuthService } from "../../shared/service/auth.service";


@Component({
    templateUrl: './personal-details-dialog-form.component.html',
    styleUrls: ['./personal-details-dialog-form.component.css'],

  })

  export class PersonalDetailsDialogForm implements OnInit {

    titles:any[] = environment.TITLES;

    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, private authService: AuthService,  
      public matDialogRef: MatDialogRef<PersonalDetailsDialogForm>, private changeDetectorRef:ChangeDetectorRef, private router:Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){
    }

    ngOnInit(): void { 
      this.applicantService.RefereeForm.reset();
      if(this.data && this.data.refereeData){
           this.populateRefereeData(this.data.refereeData);
      }

    }

    populateRefereeData(data:any):void{
      this.applicantService.RefereeForm.controls['refereeID'].setValue(data.refereeID);
      this.applicantService.RefereeForm.controls['fullName'].setValue(data.fullName);
      this.applicantService.RefereeForm.controls['title'].setValue(data.title);
      this.applicantService.RefereeForm.controls['institutionName'].setValue(data.institutionName);
      this.applicantService.RefereeForm.controls['emailAddress'].setValue(data.emailAddress);
      this.applicantService.RefereeForm.controls['mobileNo'].setValue(data.mobileNo);
      this.applicantService.RefereeForm.controls['address'].setValue(data.address);
    }

    

    onSubmit():void{
      this.applicantService.RefereeForm.markAllAsTouched();
      if (this.applicantService.RefereeForm.valid) {
        if(this.data.operation === 'Insert'){ //insert 
          this.matDialogRef.close({'data':this.applicantService.RefereeForm.value, 'operation': this.data.operation});
        }
        else{ //update
          this.matDialogRef.close({'data':this.applicantService.RefereeForm.value, 'operation': this.data.operation});
        }
       
      }
    }

    onClose(){
      this.matDialogRef.close();
    }

   


  }


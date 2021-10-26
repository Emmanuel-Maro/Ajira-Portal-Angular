import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from "../../shared/service/app.service";
import { Router } from "@angular/router";
import { DataProvider } from "../../shared/service/data-provider";
import { AlertTypes } from "../../shared/enums/alert-type";
import { DialogService } from "../../shared/service/dialog.service";

  
@Component({
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit, AfterViewInit {
    resetPasswordForm: FormGroup;
    emailRegx:RegExp = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
    emailAddress: string;


    constructor(private formBuilder: FormBuilder, private appService:AppService, private router: Router, private _snackBar: MatSnackBar, 
        private dataProvider:DataProvider, public dialogService: DialogService, private spinner: NgxSpinnerService) 
    { 

       
    }
  
    ngOnInit() {
  
        this.resetPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(this.emailRegx)]],
          })
    }

    ngAfterViewInit(): void {
        //throw new Error("Method not implemented.");
    }

    resetPassword() {
        this.resetPasswordForm.markAllAsTouched();
        if(this.resetPasswordForm.valid){
            this.spinner.show();
            this.appService.forgotPassword(this.resetPasswordForm.controls['email'].value).subscribe(result=>{
                this.spinner.hide();
                this.dialogService.openAlertDialog("Success", "Password reset email sent!", AlertTypes.Success);
                this.resetPasswordForm.reset();
            },errorResponse=>{ 
              this.spinner.hide();
              console.log(errorResponse);
              this.dialogService.openAlertDialog("Warning Message", errorResponse.message, AlertTypes.Error);
            });
        }
    }

}
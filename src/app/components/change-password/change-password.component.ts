import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import { AppService } from "../../shared/service/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DataProvider } from "../../shared/service/data-provider";
import { AlertTypes } from "../../shared/enums/alert-type";
import { ErrorStateMatcher } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogService } from "../../shared/service/dialog.service";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})


export class ChangePasswordComponent implements OnInit {
    changePasswordForm: FormGroup;
    errorMatcher = new CrossFieldErrorMatcher();
    accountInfo:any = {};
    hideOldPassword:boolean = true;
    hideNewPassword:boolean = true;
    hideConfirmPassword:boolean = true;

    constructor(private formBuilder: FormBuilder, private appService:AppService, private route: ActivatedRoute, 
        private dataProvider:DataProvider, public dialogService: DialogService, private spinner: NgxSpinnerService){ 
      this.accountInfo = this.route.snapshot.data['AccountInfo']; 
       
    }
  
    ngOnInit() {
        this.changePasswordForm = this.formBuilder.group({
          oldPassword: ['',[Validators.required]],
          newPassword: ['',[Validators.required]],
          confirmPassword:  ['',[Validators.required]],
          },{
            validator: this.passwordValidator
          })
    }

    passwordValidator(form: FormGroup) {
      const condition = form.get('newPassword').value !== form.get('confirmPassword').value;
  
      return condition ? { passwordsDoNotMatch: true} : null;
    }

    resetPassword() {
        
        if (this.changePasswordForm.valid) {
            this.spinner.show();
            let resetPasswordModel = {
              'oldpassword': this.changePasswordForm.value.oldPassword,
              'newPassword': this.changePasswordForm.value.newPassword,
            }
            this.appService.resetPassword(resetPasswordModel).subscribe(response=>{
              this.spinner.hide();
               this.dialogService.openAlertDialog("Success", "Password changed successfuly", AlertTypes.Success);
               this.changePasswordForm.reset();
              console.log(response);
            },errorResponse=>{ 
              this.spinner.hide();
              console.log(errorResponse);
              this.dialogService.openAlertDialog("Error", errorResponse.data, AlertTypes.Error);
            });
        }
    }

}
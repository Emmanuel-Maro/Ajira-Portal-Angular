import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import { AppService } from "../../shared/service/app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DataProvider } from "../../shared/service/data-provider";
import { AlertTypes } from "../../shared/enums/alert-type";
import { ErrorStateMatcher, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogService } from "../../shared/service/dialog.service";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})


export class ResetPasswordComponent implements OnInit {
    resetPasswordForm: FormGroup;
    errorMatcher = new CrossFieldErrorMatcher();
    resetToken:string ;
    hideNewPassword:boolean = true;
    hideConfirmPassword:boolean = true;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(private formBuilder: FormBuilder, private appService:AppService, private route: ActivatedRoute, private snackBar: MatSnackBar, 
        private dataProvider:DataProvider, public dialogService: DialogService, private router:Router,  private spinner: NgxSpinnerService){ 
          this.resetToken = this.route.snapshot.paramMap.get('resetToken');
          console.log(this.resetToken);
    }
  
    ngOnInit() {
        this.resetPasswordForm = this.formBuilder.group({
          newPassword: ['',[Validators.required]],
          confirmPassword:  ['',[Validators.required]],
          },{
            validator: this.passwordValidator
          });

          this.resetPasswordForm.controls['newPassword'].setValue(null);
    }

    passwordValidator(form: FormGroup) {
      const condition = form.get('newPassword').value !== form.get('confirmPassword').value;
  
      return condition ? { passwordsDoNotMatch: true} : null;
    }

    resetPassword() {
        if (this.resetPasswordForm.valid) {
            this.spinner.show();
            let resetPasswordModel = {
              "resetToken": this.resetToken,
              "newPassword": this.resetPasswordForm.value.newPassword
            }
            this.appService.changePassword(resetPasswordModel).subscribe(response=>{
              console.log(response);
              this.spinner.hide();
               this.openSnackBar("Password changed successfuly", "success-snackbar");
               this.resetPasswordForm.reset();
               this.router.navigate(['/login']);
            },errorResponse=>{ 
              this.spinner.hide();
              console.log(errorResponse);
              this.dialogService.openAlertDialog("Error", errorResponse.data, AlertTypes.Error);
            });
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

}

import { Component, OnInit, AfterViewInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertTypes } from "../../shared/enums/alert-type";
import { AppService } from "../../shared/service/app.service";
import { DataProvider } from "../../shared/service/data-provider";
import { DialogService } from "../../shared/service/dialog.service";
import {v4 as uuidv4} from 'uuid';
import { data } from "jquery";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}
  
@Component({
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
    
    registrationForm: FormGroup;
    errorMatcher = new CrossFieldErrorMatcher();
    accountInfo:any = {};
    hidePassword:boolean = true;
    hideConfirmPassword:boolean = true;

    constructor(private formBuilder: FormBuilder, private appService:AppService, private route: ActivatedRoute, private router: Router,
        private dataProvider:DataProvider, public dialogService: DialogService, private spinner: NgxSpinnerService){ 
      //this.accountInfo = this.route.snapshot.data['AccountInfo']; 
       
    }
  
    ngOnInit() {
     
        this.registrationForm = this.formBuilder.group({
          //firstName: [null,[Validators.required]],
          //middleName: [null],
          //lastName: [null,[Validators.required]],
         // msisdn:[null,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          email: ['',[Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          password: [null,[Validators.required, Validators.minLength(8)]],
          confirmPassword:  ['',[Validators.required, Validators.minLength(8)]],
          },{
            validator: this.passwordValidator
          })
    }

    passwordValidator(form: FormGroup) {
      const condition = form.get('password').value !== form.get('confirmPassword').value;
  
      return condition ? { passwordsDoNotMatch: true} : null;
    }

    register() {
          this.registrationForm.markAllAsTouched();
          /*Object.keys(this.registrationForm.controls).forEach(key => {

            const controlErrors: ValidationErrors = this.registrationForm.get(key).errors;
            if (controlErrors != null) {
                  Object.keys(controlErrors).forEach(keyError => {
                    console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                  });
                }
              });*/
        if (this.registrationForm.valid) {
            this.spinner.show();
            let registrationModel = {
              'email': this.registrationForm.value.email,
              'password': this.registrationForm.value.password
            }
            this.appService.register(registrationModel).subscribe(response=>{ console.log(response);
              this.spinner.hide();
              if(response.statusCode === 2501){
                //this.dialogService.openAlertDialog("Info", response.message, AlertTypes.Success);
                this.router.navigate(['/registration-success'],{ queryParams: { email: response.data.email}});
              }
              else{ 
                this.dialogService.openAlertDialog("Waring Message", response.message, AlertTypes.Warning);
               // this.registrationForm.reset();
              }
            },errorResponse=>{ 
              this.spinner.hide();
              console.log(errorResponse);
              this.dialogService.openAlertDialog("Error", errorResponse.message, AlertTypes.Error);
            });
        }
    }

}

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertTypes } from "../../shared/enums/alert-type";
import { AppService } from "../../shared/service/app.service";
import { DataProvider } from "../../shared/service/data-provider";
import { DialogService } from "../../shared/service/dialog.service";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}
  
@Component({
	templateUrl: './feedback.component.html',
	styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  fileObject:any = {};
  @ViewChild('attachmentFile') attachmentFile: ElementRef;

    constructor(private formBuilder: FormBuilder, public appService:AppService, private route: ActivatedRoute, private snackBar: MatSnackBar,
      private changeDetectorRef:ChangeDetectorRef, public dialogService: DialogService, private spinner: NgxSpinnerService){ 

    }
  
    ngOnInit() {

    }

    passwordValidator(form: FormGroup) {
      const condition = form.get('password').value !== form.get('confirmPassword').value;
  
      return condition ? { passwordsDoNotMatch: true} : null;
    }

    onFileChange(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
       
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1048) <= 2048){
              
            this.fileObject.fileName = file.name;
            this.fileObject.fileType = file.type;
            this.fileObject.fileSize = file.size;
            this.fileObject.fileData = (<string>reader.result).split(',')[1];  
            this.appService.FeedbackForm.controls['file'].setValue(this.fileObject.fileData);
            this.appService.FeedbackForm.controls['fileExtension'].setValue( '' + this.fileObject.fileType.split('/')[1]);
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload(Maximum size is 2MB)", "warning");
            this.attachmentFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
          }
        };
      }
      
    }

    onSubmit():void{
      this.appService.FeedbackForm.markAllAsTouched();
      if (this.appService.FeedbackForm.valid) {
        let feeback = this.appService.FeedbackForm.value;
        this.appService.sendFeedback(feeback).subscribe(result=>{
           this.appService.FeedbackForm.reset();
           this.attachmentFile.nativeElement.value = '';
           this.openSnackBar("Your feedback has been sent successfully!", "success-snackbar");
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
        //feeback.
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
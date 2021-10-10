
import { OnInit, Component, Optional, Inject, ChangeDetectorRef, ElementRef, ViewChild,  } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import {  MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";
import { OtherPersonalDetailsDialogFormComponent } from "./other-personal-details-dialog-form.component";


export const APP_DATE_FORMATS =
{
    parse: {
        dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
      // dateInput: 'DD.MM.YYYY',
    },
    display: {
        dateInput: { year: 'numeric', month: 'short',  day: 'numeric' },
        monthYearLabel: { year: 'numeric' }
    }
};

@Component({
    templateUrl: './nida-questions-dialog-form.component.html',
    styleUrls: ['./nida-questions-dialog-form.component.css'],
    providers: [ { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
  })

  export class NidaQuestionsDialogForm implements OnInit {
    nin:string;
    rqCode:string;
    questionEn:string;
    questionSw:string;
    qnAnsw:string;
    
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    applicantAnswers: string[] = [];

    constructor(public applicantService: ApplicantService,  private dialog: MatDialog, private snackBar: MatSnackBar,
      public matDialogRef: MatDialogRef<NidaQuestionsDialogForm>, private changeDetectorRef:ChangeDetectorRef,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogService: DialogService, private spinner: NgxSpinnerService){
        console.log(this.data.dialogData);
    }

    ngOnInit(): void { 
      if(this.data.dialogData){
        this.nin = this.data.nin;
        this.rqCode = this.data.dialogData.rqCode;
        this.questionEn = this.data.dialogData.qnEn;
        this.questionSw = this.data.dialogData.qnSw;
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
          this.matDialogRef.close();
        }
        else if(result.statusCode === 2505){
          this.matDialogRef.close(result.data);
        }
       else{
        this.qnAnsw = '';
        this.applicantAnswers.push(result.data.preQnAnsw);
        this.questionEn = result.data.qnEn;
        this.questionSw = result.data.qnSw;
        this.rqCode = result.data.rqCode;
        this.changeDetectorRef.detectChanges();
       } 
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

    onClose(){;
      this.matDialogRef.close();
    }

    onEdit():void{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = "80%";
      //dialogConfig.height="50%";
      dialogConfig.data = {'originality': '' };
      this.dialog.open(OtherPersonalDetailsDialogFormComponent, dialogConfig).afterClosed().subscribe(formData =>{ 
                //if(formData){
                  
               // }
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

  }


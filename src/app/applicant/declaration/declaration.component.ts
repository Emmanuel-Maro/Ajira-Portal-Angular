import { OnInit, Component, ViewChild, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import { ApplicantService } from "../service/applicant.service";
import { AcademicQualificationDialogForm } from "../applicant-dialog-forms/academic-qualification-dialog-form.component";
import { NgIdleService } from "../service/ng-idle.service";
import { AuthService } from "../../shared/service/auth.service";
import { Router } from "@angular/router";
import { DialogService } from "../../shared/service/dialog.service";
import { environment } from "../../../environments/environment";

@Component({
    templateUrl: './declaration.component.html',
    styleUrls: ['./declaration.component.css'],
    providers: [NgIdleService]
  })

  export class DeclarationComponent implements OnInit,  OnDestroy {
    checked:boolean = false;
    disabled:boolean = false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    firstLevelTimer:number = environment.FIRST_LEVEL_TIMER;
    secondLevelTimer:number = environment.SECOND_LEVEL_TIMER;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;

      constructor(private ngIdle: NgIdleService, private applicantService: ApplicantService, private authService: AuthService, private changeDetectorRef:ChangeDetectorRef,
        private dialogService: DialogService, private dialog: MatDialog, private snackBar: MatSnackBar, private router:Router){
         
          this.declaration();
         
      }

      ngOnInit(): void {

      }

      ngOnDestroy(): void {
        console.log('on destroy method called');
      }

      declaration():void{
        this.applicantService.isDeclared().subscribe(result=>{
          this.checked = result.data;
          if(this.checked) this.disabled = true;
          this.changeDetectorRef.detectChanges();
         },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
        });
      }

     
       
      onDeclaration():void {
        this.applicantService.declaration({}).subscribe(response=>{
          this.openSnackBar("successfully declared", "success-snackbar");
          this.declaration();
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.data)
            this.dialogService.openAlertDialog("Error", errorResponse.data, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
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

     
  }
  
  
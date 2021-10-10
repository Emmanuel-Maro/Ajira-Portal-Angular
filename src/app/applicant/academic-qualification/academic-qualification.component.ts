import { OnInit, Component, ViewChild, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { DatePipe } from "@angular/common";
import { ApplicantService } from "../service/applicant.service";
import { AcademicQualificationDialogForm } from "../applicant-dialog-forms/academic-qualification-dialog-form.component";
import { DialogService } from "../../shared/service/dialog.service";
import { Router } from "@angular/router";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { environment } from "../../../environments/environment";
import { NgIdleService } from "../service/ng-idle.service";
import { AuthService } from "../../shared/service/auth.service";

@Component({
    templateUrl: './academic-qualification.component.html',
    styleUrls: ['./academic-qualification.component.css'],
    providers: [NgIdleService]
 
  })

  export class AcademicQualificationComponent implements OnInit {
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    datePipe = new DatePipe('en-US');
    @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    loading:boolean = true;
    displayedColumns:string[] = [];
    contextMenuPosition = { x: '0px', y: '0px' };
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    firstLevelTimer:number = environment.FIRST_LEVEL_TIMER;
    secondLevelTimer:number = environment.SECOND_LEVEL_TIMER;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;
    FULL_DASH_ARRAY = 283;

      constructor(private ngIdle: NgIdleService, private applicantService: ApplicantService, private dialog: MatDialog, private dialogService: DialogService,
        private changeDetectorRef:ChangeDetectorRef, private router:Router, private snackBar: MatSnackBar, private authService: AuthService){
          this.getAcademicQualifications();       

      }

      ngOnInit(): void {
        this.displayedColumns = ['educationLevel', 'programmeName',  'dateFrom', 'dateTo', 'institutionName', 'actions']; 
      }
      
      getAcademicQualifications():void{
        this.applicantService.academicQualifications().subscribe(result=> {
          this.loading = false;
          this.dataSource.data =  result.data;
          console.log(result.data);
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
          this.loading = false;
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
      }

      onPreview(row):void{ 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = "80%";
       // dialogConfig.height="90%";
        dialogConfig.data = {'attachmentType': 'pdf', 'attachmentUrl': row.attachmentUrl};
        this.dialog.open(AttachmentPreviewDialogComponent, dialogConfig);
      }
  


      onCreate():void{
        //this.applicantService.InitializeClaimForm();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(AcademicQualificationDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{ console.log(dialogData)
          if(dialogData){ 
            this.getAcademicQualifications();
            console.log(this.dataSource.data)
            this.openSnackBar("academic qualification has been added successfully", "success-snackbar");
          }
        });
      }

      onEdit(row:any):void{ 
        //this.applicantService.InitializeClaimForm();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Update', 'dialogData': row};
        this.dialog.open(AcademicQualificationDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{
          if(dialogData){ 
            this.getAcademicQualifications();
            this.openSnackBar("academic qualification has been updated successfully", "success-snackbar");
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
  
  
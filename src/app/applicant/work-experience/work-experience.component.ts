import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import * as pdfMake from  'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { DatePipe } from "@angular/common";
import { ApplicantService } from "../service/applicant.service";
import { AcademicQualificationDialogForm } from "../applicant-dialog-forms/academic-qualification-dialog-form.component";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { TrainingDialogForm } from "../applicant-dialog-forms/training-dialog-form.component";
import { WorkExperienceDialogForm } from "../applicant-dialog-forms/work-experience-dialog-form.component";

@Component({
    templateUrl: './work-experience.component.html',
    styleUrls: ['./work-experience.component.css'],
    
  })

  export class WorkExperienceComponent implements OnInit {
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    loading:boolean = true;
      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
         this.getWorkingExperience();
      }

      getWorkingExperience():void{
       
        this.applicantService.workingExperience().subscribe(result => {
          this.loading = false;
          this.dataSource.data = result.data;
          this.dataSource.sort = this.sort;
          this.dataSource._updateChangeSubscription();
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

      ngOnInit(): void {    
        this.displayedColumns = ['instituteName', 'jobTitle',  'dateFrom', 'dateTo', 'actions'];
      }

      onInsert():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(WorkExperienceDialogForm, dialogConfig).afterClosed().subscribe(row =>{ 
            if(row){
              this.getWorkingExperience();
              this.openSnackBar("Work experience has been added successfully..", "success-snackbar");     
            }
            
        });
      }

      onEdit(row:any):void{ 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Edit', 'dialogData':row};
        this.dialog.open(WorkExperienceDialogForm, dialogConfig).afterClosed().subscribe(row =>{ 
          if(row && row.data){ 
            //let index =  _.findIndex(this.dataSource.data, {workingExperienceId: row.data.workingExperienceId}); //primary key
            this.getWorkingExperience();
            this.openSnackBar("Work experience has been updated successfully..", "success-snackbar");       
          }
            
        });
      }

      onDelete(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
            this.applicantService.removeWorkingExperience(row.workingExperienceId).subscribe(result=>{
              this.getWorkingExperience();
              this.openSnackBar("Work experience has been removed successfully..", "success-snackbar");    
            })
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
  
  
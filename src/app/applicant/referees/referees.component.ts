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
import { RefereeDialogForm } from "../applicant-dialog-forms/referee-dialog-form.component";

@Component({
    templateUrl: './referees.component.html',
    styleUrls: ['./referees.component.css'],
    
  })

  export class RefereesComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
          this.getReferees();
      }

      ngOnInit(): void {    
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['refereeTitle', 'fullName', 'refereeOrganization', 'emailAddress', 'telephoneNumber', 'address', 'actions'];
      }

      getReferees():void{
        this.applicantService.referees().subscribe(result => {  console.log(result.data)
          this.dataSource.data = result.data;
          this.dataSource._updateChangeSubscription();

        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
        });
      }

      onInsert():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(RefereeDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{ 
          if(dialogData){
           this.getReferees();
            this.openSnackBar("Referee has been added successfully..", "success-snackbar");
          }
        });
      }

      onDelete(row:any):void{ console.log(row);
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
            this.applicantService.removeReferee(row.refereeId).subscribe(result=>{
              this.getReferees();
              this.openSnackBar("Referee has been removed successfully..", "success-snackbar");
            },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
             });
          }
        });
        
      }

      onEdit(row:any):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {'refereeData': row, 'operation': 'Edit'};
        this.dialog.open(RefereeDialogForm, dialogConfig).afterClosed().subscribe(dialogData => { 
          if(dialogData){
            this.getReferees();
            this.openSnackBar("Referee has been updated successfully..", "success-snackbar");
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
  
  
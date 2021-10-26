import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_DATE_FORMATS} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { TrainingDialogForm } from "../applicant-dialog-forms/training-dialog-form.component";
import { environment } from "../../../environments/environment";

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
    templateUrl: './training.component.html',
    styleUrls: ['./training.component.css'],
    providers: [ { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }]
    
  })

  export class TrainingComponent implements OnInit {
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    loading:boolean = true;
    fileObject:any = {};
    attachmentTypes:any[] = [{'id':1, 'name':'Curriculum Vitae'},{'id':2, 'name':'Recommendation Letter'}];
    selectedAttachmentType:any;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
          this.getTraining();
      }

      ngOnInit(): void {    
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['trainingName', 'trainingInstitution', 'startDate', 'endDate', 'certificate', 'actions'];
      }

      getTraining():void{
        this.applicantService.training().subscribe(result => { console.log(result);
          this.loading = false;
          this.dataSource.data =  result.data || [];
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

      
      onFileChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
         
          let file = event.target.files[0];
          reader.readAsDataURL(file); 
          reader.onloadend = () => { 
            if(file.size/(1024) <= 2048){
                this.fileObject.fileName = file.name;
                this.fileObject.fileType = file.type;
                this.fileObject.fileSize = file.size;
                this.fileObject.fileData = (<string>reader.result).split(',')[1];  
            }
            else{
              this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
              this.attachmentFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          };
        }
        
      }

      onInsert():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(TrainingDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{ 
          if(dialogData){ 
            this.getTraining();
            this.openSnackBar("Training has been added successfully..",  "success-snackbar");       
          }
        });
      }

      onEdit(row:any):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Update', 'trainingData':row};
        this.dialog.open(TrainingDialogForm, dialogConfig).afterClosed().subscribe(dialogData =>{ 
          if(dialogData){ 
            this.getTraining();
            this.openSnackBar("Training has been updated successfully..",  "success-snackbar");  
          }
        });
      }

      onDelete(row:any):void {
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
            let training =  _.find(this.dataSource.data, {trainingId: row.trainingId}); 
            this.applicantService.deleteTraining(training.trainingId).subscribe(result=> {
              this.getTraining();
              this.openSnackBar("Training has been removed successfully..",  "success-snackbar");  
            });
          }
        });
      }

      onPreview(row:any):void{ 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'attachmentType': 'Certificate', 'fileData': row.certificateAttachment};//filePath:row.filePath
        this.dialog.open(AttachmentPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
      
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
  
  
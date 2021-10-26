import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { environment } from "../../../environments/environment";

@Component({
    templateUrl: './other-attachments.component.html',
    styleUrls: ['./other-attachments.component.css'],
    
  })

  export class OtherAttachmentsComponent implements OnInit {
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    fileObject:any = {};
    attachmentTypes:any[] = [];
    selectedAttachmentType:any;
    attachmentsDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){

          this.applicantService.getAttachmentList().subscribe(result=>{ 
            this.attachmentTypes = result.data;
          },errorResponse=>{
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
          });

          this.getAttachments();
      }

      ngOnInit(): void {    
        this.attachmentsDataSource.sort = this.sort;
        this.displayedColumns = ['otherAttachmentName', 'action_view', 'action_delete'];
      }

      getAttachments():void{
        this.applicantService.getOtherAttachments().subscribe(result=>{ console.log(result)
          this.attachmentsDataSource.data = result.data;
          this.attachmentsDataSource._updateChangeSubscription();
        },errorResponse=>{
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
            if(file.size/(1048) <= 2048){
                
                this.fileObject.fileName = file.name;
                this.fileObject.fileType = file.type.split('/')[1]; ;
                this.fileObject.fileSize = file.size;
                this.fileObject.fileData = (<string>reader.result).split(',')[1];  
                var index = _.findIndex(this.attachmentsDataSource.data, {AttachmentType: this.selectedAttachmentType.id});
                if(index < 0){
                  this.spinner.show();
                  this.applicantService.addOtherAttachments(
                    {
                      "attachmentDesc" : "",
                      "file": this.fileObject.fileData,
                      "fileExt": this.fileObject.fileType,
                      "otherAttachmentListId": this.selectedAttachmentType.id
                    }
                  ).subscribe(result=>{
                    this.spinner.hide();
                    this.selectedAttachmentType = undefined;
                    this.attachmentFile.nativeElement.value = '';
                    this.changeDetectorRef.detectChanges();
                   this.getAttachments();
                   this.openSnackBar("an attachment has been added successfully!", "success-snackbar");
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
            }
            else{
              this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
              this.attachmentFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          };
        }
        
      }
      
      onDelete(row:any):void{ console.log(row)
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
           this.applicantService.removeAttachment(row.otherAttachmentId).subscribe(result=>{
             this.getAttachments();
            this.openSnackBar("an attachment has been removed successfully!", "success-snackbar");
           },errorResponse=>{
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
          })
          }
        });
        
      }

      onPreview(row:any):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'attachmentType': row.AttachmentType, 'fileData': row.fileData};
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
  
  
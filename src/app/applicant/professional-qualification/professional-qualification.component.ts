import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";
import { ProfessionalQualificationDialogForm } from "../applicant-dialog-forms/professional-qualification-dialog-form.component";
import { environment } from "../../../environments/environment";
import { NgIdleService } from "../service/ng-idle.service";
import { AuthService } from "../../shared/service/auth.service";
import { Router } from "@angular/router";

@Component({
    templateUrl: './professional-qualification.component.html',
    styleUrls: ['./professional-qualification.component.css'],
    providers: [NgIdleService]
    
  })

  export class ProfessionalQualificationComponent implements OnInit {
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    fileObject:any = {};
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    loading:boolean = true;
    displayedColumns:string[] = [];
    firstLevelTimer:number = environment.FIRST_LEVEL_TIMER;
    secondLevelTimer:number = environment.SECOND_LEVEL_TIMER;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;
      constructor(private router:Router, private applicantService: ApplicantService,  private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar,private ngIdle: NgIdleService,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
          
          this.getProfessionalQualifications();
      }

      ngOnInit(): void {    
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['courseName', 'institutionName', 'fromDate', 'endDate', 'attachment', 'actions'];
        
      }

      getProfessionalQualifications():void{
        this.applicantService.professionalQualifications().subscribe(result => { 
          this.loading = false;
         this.dataSource.data =  result.data || [];
         this.changeDetectorRef.detectChanges();
        },errorResponse=>{
          this.loading = false;
          console.log(errorResponse);
          /*if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server");
            this.matDialogRef.close();
          }*/
      });
      }

      onPreview(row):void{ console.log(row)
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        //dialogConfig.width = "80%";
       // dialogConfig.height="90%";
        dialogConfig.data = {'attachmentType': 'pdf', 'attachmentUrl': row.url};
        this.dialog.open(AttachmentPreviewDialogComponent, dialogConfig);
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
                var index = _.findIndex(this.dataSource.data);
                if(index !== -1){
                  this.dataSource.data[index]= {'fileData': this.fileObject.fileData};
                  this.attachmentFile.nativeElement.value = '';
                  this.changeDetectorRef.detectChanges();
                } 
                else{
                  this.dataSource.data.push({'fileData': this.fileObject.fileData});
                  this.dataSource._updateChangeSubscription();
                  this.attachmentFile.nativeElement.value = '';
                  this.changeDetectorRef.detectChanges();
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

      onInsert():void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Insert'};
        this.dialog.open(ProfessionalQualificationDialogForm, dialogConfig).afterClosed().subscribe(result =>{ console.log(result)
          if(result){ 
            this.getProfessionalQualifications();
          }
          else console.log('hamna kitu')
            
        });
      }

      onEdit(row:any):void{ 
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {'operation': 'Edit', 'professionalData':row};
        this.dialog.open(ProfessionalQualificationDialogForm, dialogConfig).afterClosed().subscribe(row =>{ 
          if(row && row.data){ 
            let index =  _.findIndex(this.dataSource.data, {trainingName: row.data.trainingName}); //primary key
            //this.dataSource.data[index] = row.data;
            this.dataSource.data[0] = row.data;
            this.dataSource._updateChangeSubscription();
            this.openSnackBar("Professional Qualification has been updated successfully..");       
          }
            
        });
      }

      onDelete(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
        
            this.applicantService.deleteProfessionalQualifications(row.id).subscribe(result=>{
              let index =  _.findIndex(this.dataSource.data, {id: row.id}); 
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            },errorResponse=>{
              this.loading = false;
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                //this.openSnackBar("an error occurred when try to fetch data from remote server");
              }
          })
            
          }
        });
      }

  
      openSnackBar(message: string) {
        this.snackBar.open(message, 'close', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
      
  }
  
  
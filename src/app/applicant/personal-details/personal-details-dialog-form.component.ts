/*
import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { RefereeDialogForm } from "../applicant-dialog-forms/referee-dialog-form.component";
import { environment } from "../../../environments/environment";
import { AttachmentPreviewDialogComponent } from "../applicant-dialog-forms/attachment-preview-dialog.component";

@Component({
    templateUrl: './personal-details-dialog-form.component.html',
    styleUrls: ['./personal-details-dialog-form.component.css']
  })

  export class PersonalDetailsDialogFormComponent implements OnInit {
    selectedTabIndex:number = 0;
    @ViewChild('attachmentFile') attachmentFile: ElementRef;
    countries:any = [{'name': 'Tanzania, United Republic of'},{'name': 'Kenya'},{'name': 'Uganda'}]
    regions:any = [{'name': 'Arusha'},{'name': 'Dar es salaam'},]
    districts:any = [{'name': 'Ilala'},{'name': 'Kinondoni'},{'name': 'Temeke'}]
    gender:any = environment.GENDER_TYPES;
    maritalStatus = environment.MARITAL_STATUS;
    choices = environment.YES_NO_CHOICES;
    impairments:any = [{'name': 'Not Applicable'},{'name': 'Visual'}, {'name': 'Physical'}];
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    nationalID:string;
    originalities:any[] = [{name:'Tanzania Zanzibar'}, {name:'Tanzania Mainland'}];
    response:any ;
    answers:any[] = [];
    questions:any[] = ['Jina la kwanza la mama yako','Taja kijiji katika makazi ya kudumu', 'Jina la Mahali ulipozaliwa', 'Jina la mwisho la baba yako', 'Jina la kwanza la mama yako','Taja mwaka ulio hitimu shule ya msingi', 'Jina la pili la baba yako', 'Jina la mahali ulipozaliwa'];
    codes:number[] = [9008,9008,9008,9008,9007,9007,9008];
    fileObject:any = {};
    attachmentsDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(public applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
         
      }

      ngOnInit(): void {    
       this.applicantService.NidaInfoRequestForm.reset();
       this.displayedColumns = ['AttachmentType', 'actions'];
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
                var index = _.findIndex(this.attachmentsDataSource.data, {AttachmentType: 'Birth Certificate'});
                if(index !== -1){
                  this.attachmentsDataSource.data[index]= {'AttachmentType': 'Birth Certificate', 'fileData': this.fileObject.fileData};
                  this.attachmentFile.nativeElement.value = '';
                  this.changeDetectorRef.detectChanges();
                } 
                else{
                  this.attachmentsDataSource.data.push({'AttachmentType': 'Birth Certificate', 'fileData': this.fileObject.fileData});
                  this.attachmentsDataSource._updateChangeSubscription();
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

      onDeleteAttachment(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
            let index =  _.findIndex(this.attachmentsDataSource.data, {AttachmentType: row.AttachmentType}); 
            this.attachmentsDataSource.data.splice(index, 1);
            this.attachmentsDataSource._updateChangeSubscription();
          }
        });
        
      }


      onSubmit():void{ 
        if(this.applicantService.NidaInfoRequestForm.valid){
          
          this.applicantService.NidaInfoRequestForm.controls['nationalID'].setValue('11111111111111111111');
          let resp = {
            'qnSw' : this.questions[Math.floor(Math.random() * 7)],
          };
          this.response = {
            'data' : resp,
            'code': this.codes[Math.floor(Math.random() * 7)]
          };
          if(this.response.code === 9007 || this.response.code === 9008){
            this.answers.push('correct');
          }
          else this.answers.push('wrong');
          if(this.answers.length == 5){
            this.response = undefined;
            this.applicantService.NidaInfoRequestForm.reset();
          }
          //console.log(this.response);
        }
      }

      onDelete(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
         
        });
        
      }

      onEdit(row:any):void{
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.height="90%";
        dialogConfig.data = {'refereeData': row, 'operation': 'Edit'};
        this.dialog.open(RefereeDialogForm, dialogConfig).afterClosed().subscribe(row =>{ 
        
        });
      }

      addContactDetails():void{

      }
  
      openSnackBar(message: string) {
        this.snackBar.open(message, 'close', {
          duration: 5000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
      
  }
  */
  
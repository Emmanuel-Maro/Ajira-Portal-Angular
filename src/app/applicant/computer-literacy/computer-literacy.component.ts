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
import { environment } from "../../../environments/environment";

@Component({
    templateUrl: './computer-literacy.component.html',
    styleUrls: ['./computer-literacy.component.css'],
    
  })

  export class ComputerLiteracyComponent implements OnInit {
    attachmentBaseUrl:string = environment.attachmentBaseUrl;
    fileObject:any = {};
    @ViewChild('attachmentFile')  attachmentFile: ElementRef;
    loading:boolean = false;
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    skills:any[] = [];
    base64Certificate:any;


    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(public applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){
          this.applicantService.computerSkills().subscribe(result=> { 
            this.skills =  result.data;
           
          },errorResponse=>{
            this.loading = false;
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        });

        this.getComputerLiteracy();

        
      }

      ngOnInit(): void {    
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['skillName', 'proficiency', 'actions'];
      }

      getComputerLiteracy():void{
        this.applicantService.computerLiteracy().subscribe(result=> { 
          this.dataSource.data =  result.data;
          console.log(result.data);
        },errorResponse=>{
          this.loading = false;
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
          this.openSnackBar(errorResponse.message, "warning-snackbar");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
      }

      onInsert():void{ 
        if(this.applicantService.ComputerSkillsForm.valid){
          let computer_skill = this.applicantService.ComputerSkillsForm.value;
              computer_skill.attachmentDesc = "";
              computer_skill.file = this.fileObject.file;
              computer_skill.fileExt = this.fileObject.extension;
              console.log(computer_skill)
                this.applicantService.addComputerSkill(computer_skill).subscribe(result=>{
                 this.openSnackBar("skills has been added successfully..", "success-snackbar");
                 this.getComputerLiteracy();
                },errorResponse=>{
                  this.spinner.hide();
                 console.log(errorResponse);
                 if(errorResponse && errorResponse.message)
                   this.openSnackBar(errorResponse.message, "warning-snackbar");
                 else {
                   this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
                 } 
              });
        }
      


      }

      onDelete(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){ console.log(row);
            this.applicantService.removeComputerSkill(row.computerLiteracyId).subscribe(result=>{
              this.openSnackBar("skills has been removed successfully..", "success-snackbar");
              this.getComputerLiteracy();
            })
          }
        });
        
      }

      onCertificateAttach(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
         
          let file = event.target.files[0];
          reader.readAsDataURL(file); 
          reader.onloadend = () => { 
            if(file.size/(1048) <= 2048){
                this.fileObject.extension = file.type.split('/')[1]; ;
                this.fileObject.file = (<string>reader.result).split(',')[1];  
            }
            else{
              this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
              this.attachmentFile.nativeElement.value = '';
              this.changeDetectorRef.detectChanges();
            }
          };
        }
      }

      onSubmit():void{
        if(this.applicantService.ComputerSkillsForm.valid){
          let payload = this.applicantService.ComputerSkillsForm.value;
          payload.file = this.fileObject.file;
          payload.extension = this.fileObject.extension;
          console.log(payload)
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

      translateProficiency(proficiencyId:number): string{
        switch(proficiencyId){
          case 3: return 'Very Good';
          case 2: return 'Good';
          case 1:  return 'Fair';
          default: return '';
        }
      }
 
      isSkillsExist(skill:string):boolean{ 
        let flag:boolean = false;
        this.dataSource.data.forEach(element => { console.log(element)
          if(skill.indexOf(element.computerSkills) != -1){
            flag = true;
          }
        });

        return flag;
      }
  }
  
  
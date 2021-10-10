import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from "../../../environments/environment";
@Component({
    templateUrl: './language-proficiency.component.html',
    styleUrls: ['./language-proficiency.component.css'],
    
  })

  export class LanguageProficiencyComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    languages:any[] = environment.LANGUAGES;
    otherLanguage:string;
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
      constructor(public applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private spinner: NgxSpinnerService){

         this.getLanguage();
      }

      ngOnInit(): void {    
        this.dataSource.sort = this.sort;
        this.displayedColumns = ['languageName', 'langSpeak', 'langRead', 'langWrite', 'actions'];
      }

      getLanguage():void{
        this.applicantService.languages().subscribe(result =>{
          this.dataSource.data = result.data;
          console.log(result);
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.data)
            this.dialogService.openAlertDialog("Error", errorResponse.data, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      })
      }


      onDelete(row:any):void{
        this.dialogService.openConfirmDialog("Are you sure you want to delete?").afterClosed().subscribe(choice=>{
          if(choice){
            this.applicantService.deleteLanguage(row.applicantLanguageId).subscribe(result=>{
              this.getLanguage();
              this.openSnackBar("language proficiency has been removed successfully", "success-snackbar");
            });
          }
        });
        
      }

      onSubmit():void{
        if(this.applicantService.LanguageProficiencyForm.valid){
          if(this.applicantService.LanguageProficiencyForm.controls['language_name'].value === 'Others'){
            this.applicantService.LanguageProficiencyForm.controls['language_name'].setValue(this.otherLanguage.toUpperCase());
          }

          this.applicantService.addLanguage(this.applicantService.LanguageProficiencyForm.value).subscribe(result=>{
            this.getLanguage();
            this.openSnackBar("language proficiency has been added successfully", "success-snackbar");
            this.applicantService.LanguageProficiencyForm.reset();
            this.otherLanguage = "";
          },errorResponse=>{
            console.log(errorResponse);
            if(errorResponse && errorResponse.data)
            this.openSnackBar(errorResponse.data, "success-snackbar");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        })
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
      
      isLanguageExist(languageName:string):boolean{ 
        let flag:boolean = false;
        this.dataSource.data.forEach(element => { 
          if(languageName.indexOf(element.languageName) != -1){
            flag = true;
          }
        });

        return flag;
      }

      /*translateLanguage(languageId:string): string{
        switch(languageId){
          case '1': return 'Kiswahili';
          case '2': return 'English'
          default: return languageId;
        }
      }*/

      translateProficiency(proficiencyId:number): string{
        switch(proficiencyId){
          case 3: return 'Very Good';
          case 2: return 'Good';
          case 1:  return 'Fair';
          default: return '';
        }
      }
  }
  
  
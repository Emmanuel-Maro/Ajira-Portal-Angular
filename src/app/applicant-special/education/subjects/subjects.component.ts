import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import { NgIdleService } from '../../../applicant/service/ng-idle.service';
import { AddsubjectComponent } from '../../dialogs/addsubject/addsubject.component';
import { DataService } from '../../services/data.service';
import { DialogService } from "../../../shared/service/dialog.service";

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  subjectdataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  isSubjectSelected: boolean = false;
  loading:boolean = true;
  subjectdisplayedColumns: any;
  //subjectdataSource: any = [];
  
  constructor(private dialog: MatDialog, private dataService: DataService, private dialogService: DialogService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) { 
    this.getSubjects();
    this.isSubjectSelected = false;
  }

  ngOnInit(): void {
    this.subjectdisplayedColumns = ["sn","subject","id"]
    this.getSubjects();
    this.isSubjectSelected = false;
  }
  
  openDialog() {
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
    this.dialog.open(AddsubjectComponent, dialogConfig).afterClosed().subscribe(dialogData=>{
      this.getSubjects();
    });
  }

  getSubjects(){
    this.dataService.getSubjects('216655').subscribe(result=>{

      this.loading = false;
      this.subjectdataSource = result.data;

      if(result.data == null ){
        this.isSubjectSelected = true;
      }
      else{
        this.isSubjectSelected = false;
      }
      
      this.changeDetectorRef.detectChanges();
      //console.log(result.data);

    },errorResponse=>{
      this.loading = false;
      console.log("Error: "+errorResponse);
      if(errorResponse && errorResponse.message){
        //this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
        this.openSnackBar(errorResponse.message, "warning-snackbar");
      }
      else {
        this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
      } 

      this.changeDetectorRef.detectChanges();
    });
  }

  onDelete(subjectid: any){
    this.dataService.deleteSubject(subjectid).subscribe(result=>{

      this.loading = false;
      this.getSubjects();
      // this.subjectdataSource = result.data;
      this.changeDetectorRef.detectChanges();
      this.dialogService.openAlertDialog("Message",result.description, "");
      
    },errorResponse=>{
      this.loading = false;
      console.log("Error: "+errorResponse);
      if(errorResponse && errorResponse.message){
        //this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
        this.openSnackBar(errorResponse.message, "warning-snackbar");
      }
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

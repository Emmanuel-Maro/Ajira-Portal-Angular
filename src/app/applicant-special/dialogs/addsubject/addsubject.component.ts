import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { DataService } from '../../services/data.service';
import { cosh } from 'core-js/core/number';

@Component({
  selector: 'app-addsubject',
  templateUrl: './addsubject.component.html',
  styleUrls: ['./addsubject.component.css']
})
export class AddsubjectComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loading:boolean = false;
  mySelections: string[];

  addSubjectJson: String;
  subjects = [
    {subjectCode : "chm", name : "Chemistry"},
    {subjectCode : "phy",name: "Physics"},
    {subjectCode : "hst",name: "History"},
    {subjectCode : "ksw", name: "Kiswahili"}
  ];
  constructor(public matDialogRef: MatDialogRef<AddsubjectComponent>, private dataService: DataService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) { 
    
  }

  ngOnInit(): void {
    //this.changeDetectorRef.detectChanges();

  }

  subjectsFormControl = new FormControl();

  subjectsSelectionChanged(){
    if (this.subjectsFormControl.value.length < 3) {
      this.mySelections = this.subjectsFormControl.value;
      console.log(this.mySelections);
    } else {
      this.subjectsFormControl.setValue(this.mySelections);
      
    }
  }

  saveSubject():void{
    //console.log(this.selectedsubjectCode);

    if(this.mySelections.length <= 0){
      this.openSnackBar("Select atleast one subject", "warning-snackbar");
    }
    else{

      if(this.mySelections.length == 1){
        this.addSubjectJson = '{ "applicantId": 907,"teachingSubject": [{ "subjectCode": "'+ this.mySelections[0] +'" }]}';
      }
      else if(this.mySelections.length == 2){
        this.addSubjectJson = '{ "applicantId": 907,"teachingSubject": [{ "subjectCode": "'+ this.mySelections[0] +'" },{ "subjectCode": "'+ this.mySelections[1] +'" }]}';
      }
      this.dataService.addSubject(this.addSubjectJson).subscribe(result =>{

        this.loading = false;
        console.log("Message is: "+result.message);
        console.log(result);
        this.openSnackBar(result.description, "warning-snackbar");
        this.changeDetectorRef.detectChanges();
        this.onClose();
  
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
        this.onClose();
  
      });
    }
  }

  onClose(){;
    this.matDialogRef.close();
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

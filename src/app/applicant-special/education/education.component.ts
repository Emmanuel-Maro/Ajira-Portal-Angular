import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { forkJoin } from 'rxjs';
import { NgIdleService } from '../../applicant/service/ng-idle.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
  providers: [NgIdleService]
})
export class EducationComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  subjectdataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  isSubjectSelected: boolean = false;
  schoolloading:boolean = true;
  subloading:boolean = true;
  selectedschoolsdataSource = new MatTableDataSource<any>();
  isSchoolSelected: boolean = false;
  selectedschoolsdataArray: any[] = [];
  selectedschoolsdataDBArray: any[] = [];
  schooldisplayedColumns = ["sn","region","council","schoolName"];
  canAttach: boolean = false;
  totalschools: number = 0;

  subjectdisplayedColumns = ["sn","subject"]

  constructor(private dialog: MatDialog, private dataService: DataService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) { 
    this.getSubjects();
    this.getSelectedSchools();
  }

  ngOnInit(): void {
    //this.getSelectedSchools();
    //this.getSubjects();
    // const array = [this.dataService.getSubjects('216655'),this.dataService.getEducationSchools('216655')];

    // let multCalls = forkJoin(array);

    // multCalls.subscribe(result=>{

    //   console.log(result[0].data);
    //   this.subloading = false;
    //   this.subjectdataSource = result[0].data;

    //   console.log(result[1].data);
    //   this.schoolloading = false;

    //   this.selectedschoolsdataDBArray = result[1].data;

    //   for(var i = 0; i < this.selectedschoolsdataDBArray.length; ++i){
    //     this.selectedschoolsdataArray.push({"id": this.selectedschoolsdataDBArray[i].id,"region":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.region.regionName,"councilid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.id,"council":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.name,"schoolName":this.selectedschoolsdataDBArray[i].schoolRequirement.school.name,"schoolid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.id});
    //   }
    //   this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;


    //   this.changeDetectorRef.detectChanges();
      

   // });


  }

  getSubjects(){

    this.dataService.getSubjects('216655').subscribe(result=>{

      this.subloading = false;
      this.subjectdataSource = result.data;
      if(result.data.length > 0 ){
        this.isSubjectSelected = true;
      }
      else{
        this.isSubjectSelected = false;
      }
      this.changeDetectorRef.detectChanges();
      console.log(result.data);

    },errorResponse=>{
      this.subloading = false;
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

  getSelectedSchools(){
    this.dataService.getEducationSchools('216655').subscribe(result=>{
      this.schoolloading = false;
      console.log(result.data);

      if(result.data.length > 0 || result.data == null){
        this.isSchoolSelected = true;
      }
      else{
        this.isSchoolSelected = false;
      }

      this.selectedschoolsdataDBArray = result.data;

      for(var i = 0; i < this.selectedschoolsdataDBArray.length; ++i){
        this.selectedschoolsdataArray.push({"id": this.selectedschoolsdataDBArray[i].id,"region":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.region.regionName,"councilid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.id,"council":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.name,"schoolName":this.selectedschoolsdataDBArray[i].schoolRequirement.school.name,"schoolid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.id});
      }
      this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;

      this.changeDetectorRef.detectChanges();
    },errorResponse=>{
      this.schoolloading = false;
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

import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-selectschool',
  templateUrl: './selectschool.component.html',
  styleUrls: ['./selectschool.component.css']
})
export class SelectschoolComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loading:boolean = true;
  canAddSchool: boolean = false;
  canSaveSChools: boolean = false;
  requestobj: any;
  selectedregionid: string;
  selectedregion: any;
  selectedcouncilid: string;
  selectedcouncil: any;
  selectedschoolid: string;
  selectedshool: any;
  regions: any[] = [];
  councils: any[] = [];
  schools: any[] = [];
  selectedschoolsdataSource = new MatTableDataSource<any>();
  selectedschoolsdataArray: any[] = [];
  schooldisplayedColumns = ["sn","region","council","schoolName","schoolid"];

 


  constructor(public matDialogRef: MatDialogRef<SelectschoolComponent>, private dataService: DataService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef, 
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.getRegions();
    this.onSchoolSelected();
   }

  

  getRegions():void{
  
    this.requestobj = `{
      "firstSubjectCode": "phy",
      "secondSubjectCode": "chm"
    }`;

    this.dataService.getRegions(this.requestobj).subscribe(result =>{

      this.loading = false;
      this.regions = result.data || [];
      //console.log(this.regions);
      this.changeDetectorRef.detectChanges();

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

  //When Region is selected - get councils
  onRegionSelected(){
    this.councils = [];

    //Get Selected region object
    this.selectedregion = this.regions.find(i => i.code === this.selectedregionid);
    //console.log(this.selectedregion.name);

    this.requestobj = '{"firstSubjectCode": "phy", "regionCode": "'+this.selectedregionid+'","secondSubjectCode": "chm" }';
    this.dataService.getCouncils(this.requestobj).subscribe(result =>{
      this.loading = false;
      this.councils = result.data || [];
      if(this.councils.length <= 0){
        this.openSnackBar("No School Found", "warning-snackbar");
      }

      //console.log(this.councils);
      this.changeDetectorRef.detectChanges();

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

    this.onSchoolSelected();

  }

  //When Counsil Selected - get Schools
  onCouncilSelected(){
    this.schools = [];
    //Get Selected Council Object
    this.selectedcouncil = this.councils.find(i => i.code === this.selectedcouncilid);
    //console.log(this.selectedcouncil.name);

    this.requestobj = '{"firstSubjectCode": "phy", "councilCode": "'+this.selectedcouncilid+'","secondSubjectCode": "chm" }';
    this.dataService.getSchools(this.requestobj).subscribe(result =>{
      this.loading = false;
      this.schools = result.data || [];
      if(this.schools.length <= 0){
        this.openSnackBar("No School Found", "warning-snackbar");
      }
      //console.log(this.schools);
      this.changeDetectorRef.detectChanges();

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

    this.onSchoolSelected();
  }

  onSchoolSelected(){
    if(this.selectedschoolid != "" && this.schools.length >0){
      this.canAddSchool = true;

      //get selected School object
     this.selectedshool = this.schools.find(i => i.id === this.selectedschoolid);
     //console.log(this.selectedshool.schoolName);

    }
    else{
      this.canAddSchool = false;
    }
  }

  //Add selected Schools
  onSchoolAdded(){
    if(this.selectedschoolsdataArray.length < 5 ){

      // if((this.selectedschoolsdataArray.find(i => i.schoolid === this.selectedshool.id)).length > 0){
      //   this.openSnackBar("School already added","warning-snackbar");
      // }
      // else{
        this.selectedschoolsdataArray.push({"region":this.selectedregion.name,"council":this.selectedcouncil.name,"schoolName":this.selectedshool.schoolName,"schoolid":this.selectedshool.id});
        this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;
        console.log(this.selectedschoolsdataArray);
        //this.changeDetectorRef.detectChanges();
      //}
    }
    else{
      this.openSnackBar("You can only choose five Schools","warning-snackbar");
    }

    this.canSaveFn();
  }

  canSaveFn(){
    if(this.selectedschoolsdataArray.length == 5){
      this.canSaveSChools = true;
    }
    else{
      this.canSaveSChools = false;
    }
  }

  onSchoolDeleted(schoolid:any){
    for (var i = this.selectedschoolsdataArray.length - 1; i >= 0; --i) {
      if (this.selectedschoolsdataArray[i].schoolid == schoolid) {
        this.selectedschoolsdataArray.splice(i,1);
      }
   }
   this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;
   console.log(this.selectedschoolsdataArray);
   this.canSaveFn();
  }

  ngOnInit(): void {
    //data from parent
    //console.log(this.data.name);
    this.selectedschoolsdataArray = this.data.schoolFromParent;
    this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;
    this.canSaveFn();
  }

  onClose(){
    //data to parent
    this.matDialogRef.close({"selectedSchools":[]});
  }

  onSave(){
    this.matDialogRef.close({"selectedSchools":this.selectedschoolsdataArray});
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

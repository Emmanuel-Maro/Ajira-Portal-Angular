import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar, MatTableDataSource } from '@angular/material';
import { SelectschoolComponent } from '../../dialogs/selectschool.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.css']
})
export class SchoolsComponent implements OnInit {

  constructor(private dialog: MatDialog, private dataService: DataService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) {
    this.canAttachFn();
    this.getSelectedSchools();
   }

  selectedschoolsdataSource = new MatTableDataSource<any>();
  selectedschoolsdataArray: any[] = [];
  selectedschoolsdataDBArray: any[] = [];
  schooldisplayedColumns = ["sn","region","council","schoolName"];
  canAttach: boolean = false;
  totalschools: number = 0;
  loading: boolean = false;

  ngOnInit(): void {
    
  }

  openDialog(){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
        dialogConfig.data = {"schoolFromParent":this.selectedschoolsdataArray};
    this.dialog.open(SelectschoolComponent, dialogConfig).afterClosed().subscribe(result=>{
      //this.getSubjects();
      //console.log(result.jina);
      this.selectedschoolsdataArray = result.selectedSchools;
      this.selectedschoolsdataSource.data = result.selectedSchools;
      this.canAttachFn();
    });
  }

  canAttachFn(){
    if(this.selectedschoolsdataArray.length == 5){
      this.canAttach = true;
    }
    else{
      this.canAttach = false;
    }
  }

  getSelectedSchools(){
    this.loading = true;
    this.dataService.getEducationSchools('216655').subscribe(result=>{

      this.selectedschoolsdataDBArray = result.data;

      for(var i = 0; i < this.selectedschoolsdataDBArray.length; ++i){
        this.selectedschoolsdataArray.push({"id": this.selectedschoolsdataDBArray[i].id,"region":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.region.regionName,"councilid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.id,"council":this.selectedschoolsdataDBArray[i].schoolRequirement.school.council.name,"schoolName":this.selectedschoolsdataDBArray[i].schoolRequirement.school.name,"schoolid":this.selectedschoolsdataDBArray[i].schoolRequirement.school.id});
      }
      this.selectedschoolsdataSource.data = this.selectedschoolsdataArray;
      //console.log(this.selectedschoolsdataArray);
      this.canAttachFn();

      this.loading = false;

    });
  }

}

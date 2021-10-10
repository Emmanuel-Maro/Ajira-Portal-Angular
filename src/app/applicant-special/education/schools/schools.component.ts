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
   }

  selectedschoolsdataSource = new MatTableDataSource<any>();
  selectedschoolsdataArray: any[] = [];
  schooldisplayedColumns = ["sn","region","council","schoolName"];
  canAttach: boolean = false;

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
    if(this.selectedschoolsdataArray.length > 0){
      this.canAttach = true;
    }
    else{
      this.canAttach = false;
    }
  }

}

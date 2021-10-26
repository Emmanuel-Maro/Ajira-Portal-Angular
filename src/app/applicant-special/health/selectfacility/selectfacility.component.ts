import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { AddfacilityComponent } from '../../dialogs/addfacility.component';
import { AddsubjectComponent } from '../../dialogs/addsubject/addsubject.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-selectfacility',
  templateUrl: './selectfacility.component.html',
  styleUrls: ['./selectfacility.component.css']
})
export class SelectfacilityComponent implements OnInit {

  constructor(private dialog: MatDialog, private dataService: DataService, private snackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  
  openDialog(){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        //dialogConfig.height="90%";
    this.dialog.open(AddfacilityComponent, dialogConfig).afterClosed().subscribe(dialogData=>{
      //this.getSubjects();
    });

  }
}

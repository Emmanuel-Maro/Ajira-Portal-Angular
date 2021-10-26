import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, Optional } from "@angular/core";
import { timer } from "rxjs";
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from "@angular/router";
import { AuthService } from "../shared/service/auth.service";
import { environment } from "../../environments/environment";


@Component({
	templateUrl: './idle-timeout-dialog.component.html',
	styleUrls: ['./idle-timeout-dialog.component.css'],
})

export class IdleTimeoutDialogComponent implements OnInit {
  config:any = {};
  constructor( private dialog: MatDialog,  public matDialogRef: MatDialogRef<IdleTimeoutDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private router:Router, ){
      
      this.config = {'leftTime': environment.SECOND_LEVEL_TIMER * 59, 'format': 'm:s'}
  }

  ngOnInit(): void { 

  }  

  done(event):void{
    if(event.left === 0){
      this.logout();
    }
  }

  continue(): void {
    this.matDialogRef.close('CONTINUE');
  }

  logout(): void {
    this.matDialogRef.close('LOGOUT');
  }

  onClose(flag:boolean){
    this.matDialogRef.close(flag);
  }


}

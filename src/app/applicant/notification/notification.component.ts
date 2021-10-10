import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import { NotService } from '../../shared/service/not.service';



@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})



export class NotificationComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private spinner: NgxSpinnerService, private snackBar: MatSnackBar, private notService: NotService) {
    //this.spinner.show();
    //this.spinner.hide();

   }

  //Placement
  placementColumns: string[] = ['post','employer_name', 'placement_date', 'report_date', 'description'];
  placementdataSource = this.notService.placement_data;
  placement_status: Boolean = this.notService.placement_status;

  //Vacancies
  vacancies_status: Boolean = this.notService.vacancies_status;
  vacanciesColumns: string[] = ['post','employer_name', 'closing_date','advert_id'];
  vacanciesdataSource = this.notService.vacancies_data;
  

  ngOnInit(): void {
  }

  testSnack(): void{
    this.openSnackBar("Saved Successfully!", "success-snackbar");
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


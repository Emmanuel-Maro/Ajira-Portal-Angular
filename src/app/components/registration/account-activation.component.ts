
import { Component} from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AppService } from "../../shared/service/app.service";
import { DialogService } from "../../shared/service/dialog.service";


@Component({
	templateUrl: './account-activation.component.html',
	styleUrls: ['./account-activation.component.css']
})

export class AccountActivationComponent  {
    userId:string;
    token:string;
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    constructor(private router: Router,private route: ActivatedRoute, private snackBar: MatSnackBar, 
      private appService:AppService,private dialogService: DialogService, private spinner: NgxSpinnerService){
        this.userId = this.route.snapshot.paramMap.get('userId');
        this.token = this.route.snapshot.paramMap.get('token');
        //${payload.userId}?token=${payload.token
        this.appService.activateAccount({userId: this.userId, token: this.token}).subscribe(result => {
          console.log(result);
          this.router.navigate(['/login'],{ queryParams: { status: 'activated'}});
        },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred while trying to update data from remote server", "warning-snackbar");
              } 
            })
         //status=activated
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
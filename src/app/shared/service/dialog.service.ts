import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../../components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatAlertDialogComponent } from '../../components/mat-alert-dialog/mat-alert-dialog.component';
import { MatAlertCustomDialogComponent } from '../../components/mat-alert-dialog/mat-alert-custom-dialog.component';

@Injectable()
export class DialogService {
    constructor(private dialog: MatDialog){

    }
    
    openConfirmDialog(message){
		return this.dialog.open(MatConfirmDialogComponent,{
			width: '400px',
            disableClose: true,
            data: { messageContent: message, },
			panelClass: 'confirm-dialog-container' 
        });
    }
    
    openAlertDialog(title:string, message:string, type:string){
		return this.dialog.open(MatAlertDialogComponent,{
			width: '45%',
            disableClose: true,
            data: {title:title, messageContent: message, type:type },
			panelClass: 'confirm-dialog-container' 
        });
	}

    openAlertCustomDialog(message:string, type:string){
		return this.dialog.open(MatAlertCustomDialogComponent,{
			width: '72%',
            disableClose: true,
            data: {messageContent: message, type:type },
			panelClass: 'confirm-dialog-container' 
        });
	}

}
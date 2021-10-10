/*
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatAlertDialogComponent } from '../../components/mat-alert-dialog/mat-alert-dialog.component';



@Injectable()
export class AlertDialogService {
    constructor(private dialog: MatDialog){

    }
    
    openAlertDialog(title:string, message:string, type:string){
		return this.dialog.open(MatAlertDialogComponent,{
			width: '400px',
            disableClose: true,
            data: {title:title, messageContent: message, type:type },
			panelClass: 'confirm-dialog-container' 
        });
	}
}

*/
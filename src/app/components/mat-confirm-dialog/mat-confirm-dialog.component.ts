



import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
  
@Component({
	templateUrl: './mat-confirm-dialog.component.html',
	styleUrls: ['./mat-confirm-dialog.component.css']
})

export class MatConfirmDialogComponent {
    public message:string;
    constructor(public dialogRef: MatDialogRef<MatConfirmDialogComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data:any) {
        this.message = data.messageContent;
    }

    onReject(){
        this.dialogRef.close();
    }

    closeDialog(){
        this.dialogRef.close(false);
    }
    
}
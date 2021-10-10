



import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
	templateUrl: './mat-alert-custom-dialog.component.html',
	styleUrls: ['./mat-alert-custom-dialog.component.css']
})

export class MatAlertCustomDialogComponent {
    public message:string;
    public type:string;

    constructor(public dialogRef: MatDialogRef<MatAlertCustomDialogComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data:any) {
        this.message = data.messageContent;
        this.type = data.type;
    }

    closeDialog(){
        this.dialogRef.close(false);
    }
    
}
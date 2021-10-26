



import { Component, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
	templateUrl: './mat-alert-dialog.component.html',
	styleUrls: ['./mat-alert-dialog.component.css']
})

export class MatAlertDialogComponent {
    public title:string;
    public message:string;
    public type:string;

    constructor(public dialogRef: MatDialogRef<MatAlertDialogComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data:any) {
        this.title = data.title;
        this.message = data.messageContent;
        this.type = data.type;
    }


    closeDialog(){
        this.dialogRef.close(false);
    }
    
}
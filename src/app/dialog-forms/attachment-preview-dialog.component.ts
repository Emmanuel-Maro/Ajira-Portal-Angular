import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, Optional } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";

@Component({
	templateUrl: './attachment-preview-dialog.component.html',
	styleUrls: ['./attachment-preview-dialog.component.css']
})

export class AttachmentPreviewDialogComponent implements OnInit {
  docData:any;
  attachmentType:string;
  filePath:string = '';
  isFilePath:boolean = false;
  constructor(private changeDetectorRef: ChangeDetectorRef,public matDialogRef: MatDialogRef<AttachmentPreviewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,){
      
  }

  ngOnInit(): void { 
    if(this.data.fileData){
      this.docData = 'data:application/pdf;base64,' + this.data.fileData;
      this.isFilePath = false;
    }
    else{
        this.filePath = this.data.filePath;
        this.isFilePath = true;
    }
    
    
    this.attachmentType = this.data.attachmentType;
    console.log(this.attachmentType);
  }  

  onClose(flag:boolean){
    this.matDialogRef.close(flag);
  }

}

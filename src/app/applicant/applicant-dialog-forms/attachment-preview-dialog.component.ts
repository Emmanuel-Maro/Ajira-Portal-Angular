import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, Optional } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { environment } from "../../../environments/environment";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	templateUrl: './attachment-preview-dialog.component.html',
	styleUrls: ['./attachment-preview-dialog.component.css']
})

export class AttachmentPreviewDialogComponent implements OnInit {
  attachmentUrl:string;
  attachmentType:string;
  constructor(private changeDetectorRef: ChangeDetectorRef, public matDialogRef: MatDialogRef<AttachmentPreviewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private spinner: NgxSpinnerService){
      
  }

  ngOnInit(): void { console.log(this.data)
    if(this.data.attachmentUrl){ 
      this.spinner.show();
      this.attachmentType = this.data.attachmentType;
      this.attachmentUrl = environment.attachmentBaseUrl + this.data.attachmentUrl;
    }
  }  

  pageRendered(e: CustomEvent) {
    this.changeDetectorRef.detectChanges();
    console.log('(page-rendered)');
    this.spinner.hide();
  }

  onClose(){
    this.matDialogRef.close();
  }

}

import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, Optional } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from "@angular/material";
import { AuthService } from "../../shared/service/auth.service";
import { DialogService } from "../../shared/service/dialog.service";

@Component({
	templateUrl: './doc-preview-dialog.component.html',
	styleUrls: ['./doc-preview-dialog.component.css']
})

export class DocPreviewDialogComponent implements OnInit {
  docData:any;
  constructor(private changeDetectorRef: ChangeDetectorRef,public matDialogRef: MatDialogRef<DocPreviewDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,){
      
  }

  ngOnInit(): void { 
    this.docData = 'data:application/pdf;base64,' + this.data;
  }  

  onClose(flag:boolean){
    this.matDialogRef.close(flag);
  }

}

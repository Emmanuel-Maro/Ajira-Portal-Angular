import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, ElementRef } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { AuthService } from "../../shared/service/auth.service";
import { DialogService } from "../../shared/service/dialog.service";
import { DocPreviewDialogComponent } from "../preview-dialog/doc-preview-dialog.component";

@Component({
	templateUrl: './advert-edit-application.component.html',
	styleUrls: ['./advert-edit-application.component.css']
})

export class AdvertEditApplicationComponent implements OnInit {
  @ViewChild('inputFile') applicationLetter: ElementRef;
  applicationLetterIsSigned:boolean = false;
  fileObject:any = {};

  constructor(private changeDetectorRef: ChangeDetectorRef,private dialogService:DialogService, private dialog: MatDialog, private authService: AuthService){
      
  }

    ngOnInit(): void {

    }  

    isAuthenticated():boolean{
      return this.authService.isLoggedIn();
    }

    onFileChange(event) {
      let reader = new FileReader();
      if(event.target.files && event.target.files.length > 0) {
        let file = event.target.files[0];
        reader.readAsDataURL(file); 
        reader.onloadend = () => { 
          if(file.size/(1024) <= 1024){
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            dialogConfig.width = "80%";
            dialogConfig.height="90%";
            dialogConfig.data = (<string>reader.result).split(',')[1];
            this.dialog.open(DocPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
              if(choice){
                this.fileObject.fileName = file.name;
                this.fileObject.fileType = file.type;
                this.fileObject.fileSize = file.size;
                this.fileObject.fileData = (<string>reader.result).split(',')[1];   
                this.applicationLetterIsSigned = choice;
                this.changeDetectorRef.detectChanges();
              }
              else {
                this.applicationLetter.nativeElement.value = '';
                this.applicationLetterIsSigned = false;
                this.changeDetectorRef.detectChanges();
              }
            });
          }
          else{
            this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
            this.applicationLetter.nativeElement.value = '';
            this.applicationLetterIsSigned = false;
            this.changeDetectorRef.detectChanges();
          }
        };
      }
    }
    

}

import { OnInit, Component, ViewChild, Inject, ChangeDetectorRef, ElementRef } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource } from "@angular/material";
import { AuthService } from "../../shared/service/auth.service";
import { DialogService } from "../../shared/service/dialog.service";
import { DocPreviewDialogComponent } from "../preview-dialog/doc-preview-dialog.component";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AdvertService } from "../service/advert.service";

@Component({
	templateUrl: './advert-apply.component.html',
	styleUrls: ['./advert-apply.component.css']
})

export class AdvertApplicationComponent implements OnInit {
  @ViewChild('inputFile') applicationLetter: ElementRef;
  applicationLetterIsSigned:boolean = false;
  fileObject:any = {};
  profileCheckToken:string;
  advert_id:string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private router: Router, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
    private dialogService:DialogService, private dialog: MatDialog, private advertService: AdvertService,private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService, private authService: AuthService){
    this.profileCheckToken = this.route.snapshot.paramMap.get('verificationToken');
    this.advert_id = this.route.snapshot.paramMap.get('advert_id');
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
            dialogConfig.width = "72%";
            //dialogConfig.height="90%";
            dialogConfig.data = (<string>reader.result).split(',')[1];
            this.dialog.open(DocPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
              if(choice){
                this.fileObject.fileName = file.name;
                this.fileObject.fileType = file.type.split('/')[1];
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

    apply(): void {
      this.spinner.show();
      let payload = {
        advertId: this.advert_id,
        applicationLetter: {
            content: this.fileObject.fileData,
            fileType: this.fileObject.fileType
        },
        profileCheckToken : this.profileCheckToken
      };
      this.advertService.apply(payload).subscribe(result=>{
        this.spinner.hide();
        this.dialogService.openAlertDialog("Job Application", "you have successfully applied...", "success");
        this.router.navigate(['/applicant/my-applications']);
      },errorResponse=>{
        this.spinner.hide();
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
          });
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

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatDialogConfig, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocPreviewDialogComponent } from '../../home/preview-dialog/doc-preview-dialog.component';
import { AdvertService } from '../../home/service/advert.service';
import { AuthService } from '../../shared/service/auth.service';
import { DialogService } from '../../shared/service/dialog.service';

@Component({
  selector: 'app-attachletter',
  templateUrl: './attachletter.component.html',
  styleUrls: ['./attachletter.component.css']
})
export class AttachletterComponent implements OnInit {

  @ViewChild('inputFile') applicationLetter: ElementRef;
  applicationLetterIsSigned:boolean = false;
  fileObject:any = {};
  profileCheckToken:string;
  advert_id:string;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loading:boolean = false;

  constructor(private dialogService: DialogService, private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef,private snackBar: MatSnackBar){
    //this.profileCheckToken = this.route.snapshot.paramMap.get('verificationToken');
    //this.advert_id = this.route.snapshot.paramMap.get('advert_id');
  }



  ngOnInit(): void {
  }

  onFileChange(event) {
    this.loading = true;
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file); 
      reader.onloadend = () => { 
        if(file.size/(1024) <= 1024){
          this.loading = false;
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
          this.loading = false;
          this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
          this.applicationLetter.nativeElement.value = '';
          this.applicationLetterIsSigned = false;
          this.changeDetectorRef.detectChanges();
        }
      };
    }
  }

  apply(): void {
    //this.spinner.show();
    let payload = {
      advertId: this.advert_id,
      applicationLetter: {
          content: this.fileObject.fileData,
          fileType: this.fileObject.fileType
      },
      profileCheckToken : this.profileCheckToken
    };

    // this.advertService.apply(payload).subscribe(result=>{
    //   //this.spinner.hide();
    //   this.dialogService.openAlertDialog("Job Application", "you have successfully applied...", "success");
    //   //this.router.navigate(['/applicant/my-applications']);
    // },errorResponse=>{
    //   //this.spinner.hide();
    //     console.log(errorResponse);
    //     if(errorResponse && errorResponse.message)
    //       this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
    //     else {
    //       //this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
    //     } 
    // });

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

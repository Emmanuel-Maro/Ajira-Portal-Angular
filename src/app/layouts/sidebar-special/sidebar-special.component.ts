import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  Inject,
  OnInit,
  ElementRef
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/service/auth.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { DataService } from '../../shared/service/data.service';
import { TokenParams } from '../../models/token-params';
import jwt_decode from 'jwt-decode';
import { DialogService } from '../../shared/service/dialog.service';
import { AppService } from '../../shared/service/app.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sidebar-special',
  templateUrl: './sidebar-special.component.html',
  styleUrls: ['./sidebar-special.component.css']
})
export class SidebarSpecialComponent implements OnInit {

  @ViewChild('imageFile') imageFile: ElementRef;
  userImage:string = 'assets/images/user.png';
  mobileQuery: MediaQueryList;
  panelOpenState = false;
  show_profile_edit_image:boolean = false;
  imagePath:string = '';//'assets/images/user.png';
  fileObject:any = {};
  private _mobileQueryListener: () => void;
  public lookups:any;
  public makes:Array<any> = new Array<any>();
  public bodyTypes:Array<any> = new Array<any>();
  tokenParams:TokenParams;
  title:string= "click to upload photo";
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showEducation: Boolean = false;
  showHealth: Boolean = false;
  
  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public menuItems: MenuItems,
    private router:Router, private authService: AuthService, private dialogService: DialogService, private snackBar: MatSnackBar,
    @Inject(LOCAL_STORAGE) private storage: StorageService,  private dataService: DataService, private appService: AppService,
    private permissionsService: NgxPermissionsService) {

    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
    this.appService.profilePicture().subscribe(result=>{ 
       this.imagePath = environment.attachmentBaseUrl +  result.data.profile;
       this.changeDetectorRef.detectChanges();
       this.dataService.changeData({'fullName': 'Mselemu Mussa'});
    }); 

    if(!this.tokenParams){ 
      this.tokenParams = this.storage.get('tokenParams'); 
      if(this.tokenParams){
        
        let decoded_token_parts:any = jwt_decode(this.storage.get('tokenParams').access_token);  
        //var roles = JSON.parse(decoded_token_parts.role); 
        let roles: string[] = []; 
        if(!Array.isArray(decoded_token_parts.role)){
          roles.push(decoded_token_parts.role); 
        }
        else{
          roles = decoded_token_parts.role; 
        }
        this.permissionsService.loadPermissions(roles);
      }
    }
    else{
      let decoded_token_parts:any = jwt_decode(this.tokenParams.access_token); 
      let roles: string[] = []; 
      if(!Array.isArray(decoded_token_parts.role)){
        roles.push(decoded_token_parts.role); 
      }
      else{
        roles = decoded_token_parts.role; 
      }
      this.permissionsService.loadPermissions(roles);
    }

    //Get current router
    console.log("Current url: "+router.url);
    if(router.url.includes('/applicant/education')){
      this.showEducation = true;
      console.log("Education Route");
    }
    else if(router.url.includes('/applicant/health')){
      this.showHealth = true;
      console.log("Health Route");
    }
    

  }
  
  ngOnInit(): void { 
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  isAuthenticated():boolean{ 
     return this.authService.isLoggedIn();
   }

  logOut(): void { 
    this.authService.logout();
    this.router.navigate(['/']);
  }

  

  hasTokenParams(): boolean { 
    this.tokenParams = this.storage.get('tokenParams');
    return !!this.tokenParams;
  }

  openFile(){
    document.querySelector('input').click()
  }

  handle(event){
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
     
      let file = event.target.files[0];
      reader.readAsDataURL(file); 
      reader.onloadend = () => { 
        if(file.size/(1048) <= 524){
            this.fileObject.fileName = file.name;
            this.fileObject.fileType = file.type;
            this.fileObject.fileSize = file.size;
            this.fileObject.fileData = (<string>reader.result).split(',')[1];  
            this.imagePath =  <string>reader.result;
            this.appService.uploadApplicantImage({
              'image': this.fileObject.fileData,
              'fileExtension':this.fileObject.fileType.split('/')[1] 
            }).subscribe(result=>{

            },errorResponse=>{
              this.imageFile.nativeElement.value = '';
              this.imagePath = 'assets/images/user.png';
              this.changeDetectorRef.detectChanges();
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.openSnackBar(errorResponse.message, "warning-snackbar");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
          });
            //this.imageFile.nativeElement.value = '';
            this.changeDetectorRef.detectChanges();
        }
        else{
          this.dialogService.openAlertDialog("Warning","File is too large to upload", "warning");
          this.imageFile.nativeElement.value = '';
          this.changeDetectorRef.detectChanges();
        }
      };
    }
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

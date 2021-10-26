import { Component, OnInit, AfterViewInit, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../shared/service/auth.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Router } from '@angular/router';
import { TokenParams } from '../../models/token-params';
import { NgxPermissionsService } from 'ngx-permissions';
import { DataService } from '../../shared/service/data.service';
import { MatDialog } from '@angular/material';
import { NotService } from '../../shared/service/not.service';
declare var $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.css']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  tokenParams:TokenParams;
  userName:string = null;
  userImage:string = 'assets/images/users/profile.jpg';

  constructor(private router:Router, public authService: AuthService, private notService: NotService, private changeDetectorRef: ChangeDetectorRef, private permissionsService: NgxPermissionsService, private dialog: MatDialog,
    @Inject(LOCAL_STORAGE) private storage: StorageService, private dataService: DataService){
    
      this.dataService.getData$().subscribe(data =>{
        if(data && data.userName){
          this.userName = data.userName;
          this.changeDetectorRef.detectChanges();
        }
      });
  }
  
  ngOnInit(): void { 
    this.tokenParams = this.storage.get('tokenParams');
    if(this.tokenParams && this.tokenParams.userName){
      this.userName = this.tokenParams.userName;
      this.changeDetectorRef.detectChanges();
    }

    //Start watching for user inactivity.
    /*this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.userIdle.stopWatching();
      console.log('Time is up!'); 
      this.showSendTimerDialog();
    }
    );*/
  }

  ngOnDestroy(): void {
    //throw new Error("Method not implemented.");
  }

  isAuthenticated():boolean{ 
    return this.authService.isLoggedIn();
  }

  logOut(): void { 
    this.userName = '';
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasTokenParams(): boolean { 
    this.tokenParams = this.storage.get('tokenParams');
    return !!this.tokenParams;
  }

  public not_count = this.notService.notification_count;
  
}

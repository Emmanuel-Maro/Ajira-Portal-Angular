import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from './shared/service/auth.service';
import { UserIdleService } from 'angular-user-idle';
import { IdleTimeoutDialogComponent } from './dialog-forms/idle-timeout-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  //For debuging purpose
  subscription: Subscription;
  isTimerDialogShown:boolean = false;


  constructor(private userIdle: UserIdleService, private mediaObserver: MediaObserver, private router: Router, 
    private authService: AuthService, private dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef){}
  
  ngOnInit(): void { 
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(
      count => {
          console.log(count); 
          if(this.isAuthenticated()){
            if(!this.isTimerDialogShown){
              this.showSendTimerDialog();
              this.isTimerDialogShown = true;
           }
          }
          else {
            this.userIdle.resetTimer();
            console.log('timer reset...'); 
          }
        
         
        }
      );
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
       console.log('Time is up!');
       console.log('logout');
       this.userIdle.resetTimer();
      
      //this.userIdle.stopTimer();
    });

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      //window.scrollTo(0, 0); 
     // document.querySelector('mat-sidenav-content').scroll(0,0);
    });
    
    //For debuging purpose
    this.subscription = this.mediaObserver.media$.subscribe( (change:MediaChange)=>{
      console.log(change.mqAlias);
    });
  }

  isAuthenticated():boolean{ 
     return this.authService.isLoggedIn();
   }

   /****************************** */
   showSendTimerDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = "30%";
    dialogConfig.data = '';
    this.dialog.open(IdleTimeoutDialogComponent, dialogConfig).afterClosed().subscribe(option =>{
       if(option == 'CONTINUE'){ console.log('continue---');
       this.userIdle.stopTimer();
       this.isTimerDialogShown = false;
         
       }
       else {
        this.userIdle.stopTimer();
        this.isTimerDialogShown = false;
        this.userIdle.resetTimer();
        this.logOut();
      }
    });
  }

  logOut(): void { 
    this.authService.logout();
    this.router.navigate(['/login']);
  }



  
}


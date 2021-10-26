
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
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
  ElementRef
} from '@angular/core';

import { MenuItems } from '../shared/menu-items/menu-items';
import { AuthService } from '../shared/service/auth.service';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { NgxPermissionsService } from 'ngx-permissions';
import { DataService } from '../shared/service/data.service';
import { TokenParams } from '../models/token-params';
import { Observable } from 'rxjs';
import { AppService } from '../shared/service/app.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatSidenav } from '@angular/material';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: ['full.component.css']
})
export class FullComponent implements OnDestroy{
   // the locales the app supports
   locales = [
    { label: 'English', value: 'en-US', flag:'assets/images/flags/gb.png'},
    { label: 'Swahili', value: 'sw', flag:'assets/images/flags/tz.png'}
  ];

  // the default locale
  selectedLocale = this.locales[1].value;

  isExpanded = true;
  //
  mobileQuery: MediaQueryList;
  @ViewChild('snav') sidenav: MatSidenav;
  private _mobileQueryListener: () => void;
  //showSidebar:boolean = true;
  tokenParams:TokenParams;
  data: Observable<any>;
  lookups:any;

  constructor(private translocoService: TranslocoService, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public menuItems: MenuItems,
    private router:Router, private authService: AuthService, private appService: AppService,
    @Inject(LOCAL_STORAGE) private storage: StorageService,  private cd: ChangeDetectorRef, 
    private permissionsService: NgxPermissionsService, private dataService: DataService) {
    this.mobileQuery = media.matchMedia('(min-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
     
    this.updateLocale('en');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  updateLocale(locale) { //console.log(locale); 
    //console.log('update locale', locale);
    if (this.locales.some(l => l.value === locale)) {
      this.selectedLocale = locale;
    }
    const lang = locale.substring(0, 2);
    this.translocoService.setActiveLang(lang);
  }

  toggle() { 
    this.sidenav.toggle();
  }

  isAuthenticated():boolean{ 
   // return this.authService && this.hasTokenParams();
    return this.authService.isLoggedIn();
  }

  logOut(): void { 
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hasTokenParams(): boolean { 
    this.tokenParams = this.storage.get('tokenParams');
    return !!this.tokenParams;
  }

  onDownload():void{
    this.router.navigate(['download']);
  }
}


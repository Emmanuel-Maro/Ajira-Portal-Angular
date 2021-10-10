
import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/service/auth.guard';
import { AdvertComponent } from './advert.component';
import { AdvertApplicationComponent } from './advert_apply/advert-apply.component';
import { AdvertEditApplicationComponent } from './advert_apply/advert-edit-application.component';
import { AdvertDetailsComponent } from './advert_details/advert-details.component';



export const DashboardRoutes: Routes = [
  {
    //canActivate:[AuthGuard],
    path: '',
    component: AdvertComponent
  },
  {
    //canActivate:[AuthGuard],
    path: 'advert-details/:advert_id',
    component: AdvertDetailsComponent,
  },
  {
    canActivate:[AuthGuard],
    path: 'apply/:advert_id/:verificationToken',
    component: AdvertApplicationComponent,
  },
  {
    canActivate:[AuthGuard],
    path: 'edit-application/:advert_id',
    component: AdvertEditApplicationComponent,
  },
  
  
  
];

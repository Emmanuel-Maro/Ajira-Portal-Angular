import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './shared/service/auth.guard';
import { P404Component } from './components/error/404.component';
import { P500Component } from './components/error/500.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ResourceCentreComponent } from './components/resource-centre/resource-centre.component';
import { P401Component } from './components/error/401.component';
import { ResetPasswordComponent } from './components/change-password/reset-password.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegistrationSuccessComponent } from './components/registration/registration-success.component';
import { ResourceListComponent } from './components/resource-centre/resource-list.component';
import { AccountActivationComponent } from './components/registration/account-activation.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FullSpecialComponent } from './layouts/full-special/full-special.component';
export const AppRoutes: Routes = [
  {
    path: 'applicant',
    component: FullSpecialComponent,
    loadChildren: () => import('./applicant-special/applicant-special.module').then((module) => module.ApplicantSpecialModule)
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
        data: { title: 'Password Change' }
      },
      {
        path: '401',
        component: P401Component,
        data: { title: 'Page 401' }
      },
      {
        path: '404',
        component: P404Component,
        data: { title: 'Page 404' }
      },
      {
        path: '500',
        component: P500Component,
        data: { title: 'Page 500' }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login Page' }
      },
      {
        path: 'reset-password/:resetToken',
        component: ResetPasswordComponent
     },
      {
         path: 'register',
         component: RegistrationComponent
      },
      {
        path: 'registration-success',
        component: RegistrationSuccessComponent,
      },
      {
        path: 'activate-account/:userId/:token',
        component: AccountActivationComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: { title: 'Login Page' }
      },
      {
        path: 'subscription',
        component: SubscriptionComponent
      },
      {
        path: 'feedback',
        component: FeedbackComponent
      },
      {
        path: 'resource-centre',
        component: ResourceCentreComponent
      },
      {
        path: 'resource-list',
        component: ResourceListComponent
      },
      {
        path: 'disclaimer',
        component: DisclaimerComponent
      },
      {
        //canActivate:[AuthGuard],
        path: 'home',
        loadChildren:
        () => import('./home/advert.module').then(m => m.AdvertModule)
      },
      {
        canActivate:[AuthGuard],
        path: 'applicant',
        loadChildren:
        () => import('./applicant/applicant.module').then(m => m.ApplicantModule)
      },
      /*{
        canActivate:[AuthGuard],
        path: 'employer',
        loadChildren: () => import('./employer/employer.module').then(m => m.EmployerModule)
      },*/
      //{ path: '**', component: P404Component }
      { path: '**',  redirectTo: 'home',  pathMatch: 'full'}
    ] 
  }
];

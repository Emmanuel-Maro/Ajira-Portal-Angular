

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { UserIdleModule } from 'angular-user-idle';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full.component';
import { AppHeaderComponent } from './layouts/header/header.component';
import { AppSidebarComponent } from './layouts/sidebar/sidebar.component';
import { AppFooterComponent } from './layouts/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';
import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { AppSidebarRightComponent } from './layouts/sidebar-right-inner/sidebar-right.component';
import { AuthService } from './shared/service/auth.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { DataService } from './shared/service/data.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppService} from './shared/service/app.service';
import { DataProvider } from './shared/service/data-provider';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { MatAlertDialogComponent } from './components/mat-alert-dialog/mat-alert-dialog.component';
import { P404Component } from './components/error/404.component';
import { P500Component } from './components/error/500.component';
// import your locales
import { registerLocaleData } from '@angular/common';
import localeSw from '@angular/common/locales/sw';
import localeGb from '@angular/common/locales/en-GB';

import {VgCoreModule} from 'videogular2/compiled/src/core/core';
import {VgControlsModule} from 'videogular2/compiled/src/controls/controls';
import {VgOverlayPlayModule} from 'videogular2/compiled/src/overlay-play/overlay-play';
import {VgBufferingModule} from 'videogular2/compiled/buffering';

import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ResourceCentreComponent } from './components/resource-centre/resource-centre.component';
import { P401Component } from './components/error/401.component';
import { ResetPasswordComponent } from './components/change-password/reset-password.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegistrationSuccessComponent } from './components/registration/registration-success.component';
import { MatBottomSheet, MatBottomSheetContainer } from '@angular/material';
import { ResourceListComponent } from './components/resource-centre/resource-list.component';
import { AttachmentPreviewDialogComponent } from './dialog-forms/attachment-preview-dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { VideoPlayerComponent } from './dialog-forms/video-player.component';
import { CountdownModule } from 'ngx-countdown';
import { MatAlertCustomDialogComponent } from './components/mat-alert-dialog/mat-alert-custom-dialog.component';
import { AccountActivationComponent } from './components/registration/account-activation.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { IdleTimeoutDialogComponent } from './dialog-forms/idle-timeout-dialog.component';
import { NotService } from './shared/service/not.service';
import { SidebarSpecialComponent } from './layouts/sidebar-special/sidebar-special.component';
import { FullSpecialComponent } from './layouts/full-special/full-special.component';
registerLocaleData(localeSw, 'sw');
registerLocaleData(localeGb, 'en-GB');

@NgModule({
  declarations: [
    AppComponent,
    P401Component,
    P404Component,
    P500Component,
    FullComponent,
    AppHeaderComponent,
    AppFooterComponent,
    SpinnerComponent,
    AppSidebarComponent,
    AppSidebarRightComponent,
    MatAlertDialogComponent, 
    MatConfirmDialogComponent,
    MatAlertCustomDialogComponent,
    LoginComponent,
    IdleTimeoutDialogComponent,
    RegistrationComponent,
    RegistrationSuccessComponent,
    AccountActivationComponent,
    ForgotPasswordComponent,
    FeedbackComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    SubscriptionComponent,
    ResourceCentreComponent,
    ResourceListComponent,
    DisclaimerComponent,
    AttachmentPreviewDialogComponent,
    VideoPlayerComponent,
    SidebarSpecialComponent,
    FullSpecialComponent,
  ],
  entryComponents:[
    LoginComponent, 
    IdleTimeoutDialogComponent,
    MatAlertDialogComponent, 
    MatConfirmDialogComponent,
    MatAlertCustomDialogComponent,
    MatBottomSheetContainer, 
    AttachmentPreviewDialogComponent, 
    VideoPlayerComponent, 
  ],
  imports: [
    BrowserAnimationsModule,
    CountdownModule,
    UserIdleModule.forRoot({idle: 300, timeout: 60}),
    DemoMaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    LoadingPageModule, 
    MaterialBarModule,
    BreadcrumbModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgScrollbarModule,
    PdfViewerModule,
    SharedModule,
    StorageServiceModule,
    NgxPermissionsModule.forRoot(),
    RouterModule.forRoot(AppRoutes)
  ],
  // exports:[
  //   AppHeaderComponent,
  //   AppFooterComponent,
  // ],

  providers: [
    //{ provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: LocationStrategy, useClass: PathLocationStrategy},
    AuthService, NotService, AppService, DataService, DataProvider,MatBottomSheet,
  ],
  bootstrap: ([AppComponent])
})
export class AppModule {}

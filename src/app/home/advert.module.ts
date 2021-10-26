
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardRoutes } from './advert.routing';
import { SharedModule } from '../shared/shared.module';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { CdkColumnDef } from '@angular/cdk/table';
import { AdvertComponent } from './advert.component';
import { AdvertDetailsComponent } from './advert_details/advert-details.component';
import { AdvertApplicationComponent } from './advert_apply/advert-apply.component';
import { DocPreviewDialogComponent } from './preview-dialog/doc-preview-dialog.component';
import { InterviewTimeTableDialogForm } from './dialog-forms/interview-time-table-dialog-form';
import { AdvertEditApplicationComponent } from './advert_apply/advert-edit-application.component';
import { AdvertService } from './service/advert.service';

@NgModule({
  imports: [
    SharedModule,
    DemoMaterialModule,
    FlexLayoutModule,
    MatCarouselModule.forRoot(),
    RouterModule.forChild(DashboardRoutes)
  ],
  entryComponents:[DocPreviewDialogComponent, InterviewTimeTableDialogForm],
  declarations: [
    AdvertComponent,
    AdvertDetailsComponent,
    AdvertApplicationComponent,
    AdvertEditApplicationComponent,
    InterviewTimeTableDialogForm,
    DocPreviewDialogComponent],
  providers :[CdkColumnDef, AdvertService]
})
export class AdvertModule {}
 

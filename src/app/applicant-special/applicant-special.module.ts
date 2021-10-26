import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { DecimalPipe, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ApplicantSpecialRoutingModule } from './applicant-special-routing.module';
import { EducationComponent } from './education/education.component';
import { HealthComponent } from './health/health.component';
import { AttachletterComponent } from './attachletter/attachletter.component';
import { SelectfacilityComponent } from './health/selectfacility/selectfacility.component';
import { MaterialComponentsModule } from "../material-component/material.module";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {MatBadgeModule} from '@angular/material/badge';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SubjectsComponent } from './education/subjects/subjects.component';
import {MatDialogModule} from "@angular/material";
import { AddsubjectComponent } from './dialogs/addsubject/addsubject.component';
import { SelectschoolComponent } from './dialogs/selectschool.component';
import { SchoolsComponent } from './education/schools/schools.component';
import { DocPreviewDialogComponent } from '../home/preview-dialog/doc-preview-dialog.component';
import { AddfacilityComponent } from './dialogs/addfacility.component';

@NgModule({
  entryComponents:[AddsubjectComponent, SelectschoolComponent,DocPreviewDialogComponent, AddfacilityComponent],
  imports: [
    CommonModule,
    ApplicantSpecialRoutingModule,
    MaterialComponentsModule,
    PdfViewerModule,
    MatBadgeModule,
    MatToolbarModule,
    MatCardModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule
  ],
  declarations: [EducationComponent, HealthComponent, AttachletterComponent, SelectfacilityComponent, SubjectsComponent, AddsubjectComponent, SelectschoolComponent, SchoolsComponent, AddfacilityComponent]
})
export class ApplicantSpecialModule { }

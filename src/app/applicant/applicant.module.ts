import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { DecimalPipe, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialComponentsModule } from "../material-component/material.module";
import { ApplicantService } from "./service/applicant.service";
import { AcademicQualificationComponent } from "./academic-qualification/academic-qualification.component";
import { AcademicQualificationRoutingModule } from "./applicant-routing.module";
import { AcademicQualificationDialogForm } from "./applicant-dialog-forms/academic-qualification-dialog-form.component";
import { DeclarationComponent } from "./declaration/declaration.component";
import { OtherAttachmentsComponent } from "./other-attachments/other-attachments.component";
import { AttachmentPreviewDialogComponent } from "./applicant-dialog-forms/attachment-preview-dialog.component";
import { RefereesComponent } from "./referees/referees.component";
import { RefereeDialogForm } from "./applicant-dialog-forms/referee-dialog-form.component";
import { PersonalDetailsDialogForm } from "./applicant-dialog-forms/personal-details-dialog-form.component";
import { ComputerLiteracyComponent } from "./computer-literacy/computer-literacy.component";
import { TrainingComponent } from "./training/training.component";
import { TrainingDialogForm } from "./applicant-dialog-forms/training-dialog-form.component";
import { WorkExperienceComponent } from "./work-experience/work-experience.component";
import { WorkExperienceDialogForm } from "./applicant-dialog-forms/work-experience-dialog-form.component";
import { LanguageProficiencyComponent } from "./language-proficiency/language-proficiency.component";
import { ProfessionalQualificationComponent } from "./professional-qualification/professional-qualification.component";
import { ProfessionalQualificationDialogForm } from "./applicant-dialog-forms/professional-qualification-dialog-form.component";
import { MyApplicationsComponent } from "./my-applications/my-applications.component";
import { AdvertModule } from "../home/advert.module";
import { ApplicantDashboardComponent } from "./dashboard/applicant-dashboard.component";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LostAcademicCertificateDialogForm } from "./applicant-dialog-forms/lost-academic-certificate-dialog-form";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { OtherPersonalDetailsDialogFormComponent } from "./applicant-dialog-forms/other-personal-details-dialog-form.component";
import { ContactDetailsDialogFormComponent } from "./applicant-dialog-forms/contanct-details-dialog-form.component";
import { NidaQuestionsDialogForm } from "./applicant-dialog-forms/nida-questions-dialog-form.component";
import { CVPreviewComponent } from "./cv-preview/cv-preview.component";
import { NotificationComponent } from './notification/notification.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
    imports: [
      SharedModule,
      MaterialComponentsModule,
      FormsModule,
      ReactiveFormsModule,
      PdfViewerModule,
      AdvertModule,
      AcademicQualificationRoutingModule,
      MatBadgeModule
    ],
    entryComponents:[PersonalDetailsDialogForm, ContactDetailsDialogFormComponent, AcademicQualificationDialogForm, ProfessionalQualificationDialogForm, WorkExperienceDialogForm, 
      OtherPersonalDetailsDialogFormComponent, TrainingDialogForm,  AttachmentPreviewDialogComponent, RefereeDialogForm, LostAcademicCertificateDialogForm, NidaQuestionsDialogForm],
    declarations: [
      ApplicantDashboardComponent,
      MyApplicationsComponent,
      PersonalDetailsComponent,
      ContactDetailsDialogFormComponent,
      OtherPersonalDetailsDialogFormComponent,
      PersonalDetailsDialogForm,
      AcademicQualificationDialogForm,
      AcademicQualificationComponent,
      ProfessionalQualificationComponent,
      ProfessionalQualificationDialogForm,
      WorkExperienceComponent,
      WorkExperienceDialogForm,
      TrainingComponent,
      TrainingDialogForm,
      DeclarationComponent,
      OtherAttachmentsComponent,
      AttachmentPreviewDialogComponent,
      LanguageProficiencyComponent,
      ComputerLiteracyComponent,
      RefereesComponent,
      RefereeDialogForm,
      LostAcademicCertificateDialogForm,
      NidaQuestionsDialogForm,
      CVPreviewComponent,
      NotificationComponent
    ],
    providers:[DecimalPipe, DatePipe, ApplicantService,]
    
  })
  export class ApplicantModule { }
  
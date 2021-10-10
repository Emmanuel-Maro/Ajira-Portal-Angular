import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../shared/service/auth.guard";
import { AcademicQualificationComponent } from "./academic-qualification/academic-qualification.component";
import { ComputerLiteracyComponent } from "./computer-literacy/computer-literacy.component";
import { CVPreviewComponent } from "./cv-preview/cv-preview.component";
import { ApplicantDashboardComponent } from "./dashboard/applicant-dashboard.component";
import { DeclarationComponent } from "./declaration/declaration.component";
import { LanguageProficiencyComponent } from "./language-proficiency/language-proficiency.component";
import { MyApplicationsComponent } from "./my-applications/my-applications.component";
import { NotificationComponent } from "./notification/notification.component";
import { OtherAttachmentsComponent } from "./other-attachments/other-attachments.component";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { ProfessionalQualificationComponent } from "./professional-qualification/professional-qualification.component";
import { RefereesComponent } from "./referees/referees.component";
import { TrainingComponent } from "./training/training.component";
import { WorkExperienceComponent } from "./work-experience/work-experience.component";


const routes: Routes = [
    {
      path: '',
      redirectTo:'academic-qualification',
      pathMatch:'full'
    },
    {
      canActivate:[AuthGuard],
      path: 'dashboard',
      component: ApplicantDashboardComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'personal-details',
      component: PersonalDetailsComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'my-applications',
      component: MyApplicationsComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'notification',
      component: NotificationComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'academic-qualification',
      component: AcademicQualificationComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'professional-qualifications',
      component: ProfessionalQualificationComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'language-proficiency',
      component: LanguageProficiencyComponent,
    },
    
    {
      canActivate:[AuthGuard],
      path: 'working-experience',
      component: WorkExperienceComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'training',
      component: TrainingComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'computer-literacy',
      component: ComputerLiteracyComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'referees',
      component: RefereesComponent,
    },
    {
      canActivate:[AuthGuard],
      path: 'other-attachments',
      component: OtherAttachmentsComponent,
    },
    {
      path: 'cv-preview',
      component: CVPreviewComponent,
    },
    {
      path: 'declaration',
      component: DeclarationComponent,
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class AcademicQualificationRoutingModule {}
   
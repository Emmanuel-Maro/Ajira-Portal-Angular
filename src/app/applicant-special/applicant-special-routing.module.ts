import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from '../layouts/full.component';
import { AppSidebarComponent } from '../layouts/sidebar/sidebar.component';
import { AttachletterComponent } from './attachletter/attachletter.component';
import { EducationComponent } from './education/education.component';
import { HealthComponent } from './health/health.component';
import { SelectfacilityComponent } from './health/selectfacility/selectfacility.component';
import { SubjectsComponent } from './education/subjects/subjects.component';
import { SchoolsComponent } from './education/schools/schools.component';
import { AdvertApplicationComponent } from '../home/advert_apply/advert-apply.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
      path:'',
      component: EducationComponent
      },
      {
        path:'education',
        children:[
          {
            path:'',
            component: EducationComponent
          },
          {
            path:'subjects',
            component: SubjectsComponent
          },
          {
            path:'schools',
            component:SchoolsComponent
          },
          {
            path:'letter',
            component: AttachletterComponent
            //component: AdvertApplicationComponent
          }
        ]
      },
      {
        path:'health',
        children:[
          {
            path:'',
            component:HealthComponent
          },
          {
            path:'selectfacility',
            component:SelectfacilityComponent
          },
          {
            path:'letter',
            component: AttachletterComponent
          }
        ]
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicantSpecialRoutingModule { }

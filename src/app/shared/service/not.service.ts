import { not } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotService {

  //Check notifications total
  public notification_count:any = 2; 
  public not_count = 0

  //Get placement data
  public placement_status: Boolean = true;
  public placement_data= [
    { post: 'ICT OFFICER II (Programmer)', employer_name: 'Tanzania Buildings Agency(TBA)', placement_date: '2021-09-01', report_date: '2021-09-25', description: 'You should report to your employer\'s HQ located at Dodoma'}
  ];

  //Get vacancies
  public vacancies_status: Boolean = true;
  public vacancies_data= [
    { post: 'ICT OFFICER II (Programmer) - 6 Posts', employer_name: 'e-Government Authority (eGa)', closing_date: '2020-10-01', advert_id: 3086},
    { post: 'ICT OFFICER II (Database Administrator) - 6 Posts', employer_name: 'e-Government Authority (eGa)', closing_date: '2020-10-01', advert_id: 3080},
    { post: 'ICT OFFICER II (Network Management) - 5 Posts', employer_name: 'e-Government Authority (eGa)', closing_date: '2020-10-01', advert_id: 3077}
  ];

  constructor() { }

 
}



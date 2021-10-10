import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }

  private handleError(errorResponse: HttpErrorResponse){
    if(errorResponse && errorResponse.status == 401){
        console.log('un authorized..')
    }
    return throwError(errorResponse.error); 
}

  addSubject(subject:any): Observable<any> { 
    return this.httpClient.post(environment.baseUrl + 'api/v1/applicant-subject/', subject).pipe(catchError(this.handleError));
  }

  getSubjects(applicantid:any): Observable<any> { 
    return this.httpClient.get(environment.baseUrl + 'api/v1/applicant-subject/applicant-id/'+applicantid).pipe(catchError(this.handleError));
  }

  deleteSubject(applicantsubjectid:any):Observable<any> { 
    return this.httpClient.delete(environment.baseUrl + 'api/v1/applicant-subject/id/'+applicantsubjectid).pipe(catchError(this.handleError));
  }

  getRegions(requestobj: any): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'api/v1/school-requirement/region/',requestobj).pipe(catchError(this.handleError));
  }

  getCouncils(requestobj: any): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'api/v1/school-requirement/council/',requestobj).pipe(catchError(this.handleError));
  }

  getSchools(requestobj: any): Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'api/v1/school-requirement/school/',requestobj).pipe(catchError(this.handleError));
  }

  
  

}

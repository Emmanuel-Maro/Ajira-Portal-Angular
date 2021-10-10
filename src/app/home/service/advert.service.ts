import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, forkJoin } from 'rxjs';
import { catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceAuthorization } from '../../models/claim/service-authorization';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TokenParams } from '../../models/token-params';



@Injectable()
export class AdvertService {
    constructor(private httpClient: HttpClient,  @Inject(LOCAL_STORAGE) private localStorage: StorageService) { }
    
    private handleError(errorResponse: HttpErrorResponse){
        return throwError(errorResponse.error); 
    }

    ContactDetailsForm:FormGroup = new FormGroup({
        applicantID: new FormControl(null),
        countryOfResidence: new FormControl(null, Validators.required),
        currentResidentRegion: new FormControl(null, Validators.required),
        currentResidentDistrict: new FormControl(null,Validators.required),
        mobileNo: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        boxNo: new FormControl(null, Validators.required),
        //region: new FormControl(null, Validators.required),
        //districtCode: new FormControl(null, Validators.required),
       
    });

    vacancies(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/vacancies').pipe(catchError(this.handleError));
    }
    vacancyDetails(advertId:number): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/vacancy-details/' + advertId).pipe(catchError(this.handleError));
    }

    viewTimeTable(advertId:number): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + `ajira/adverts/${advertId}/schedule`).pipe(catchError(this.handleError));
    }

    //Public
    publicVacancies(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/public/vacancies').pipe(catchError(this.handleError));
    }

    profileCheck(advertId:number): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/profile-check', {"advertId": advertId}).pipe(catchError(this.handleError));
    }


    publicVacancyDetails(advertId:number): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/public/vacancy-details/' + advertId).pipe(catchError(this.handleError));
    }

    apply(payload:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/apply', payload).pipe(catchError(this.handleError));
    }

}
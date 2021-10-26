

import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { GeoCoordinate } from "../../models/dto/geo-coordinate";
import { FormControl, FormGroup, Validators } from "@angular/forms";


@Injectable()
export class AppService {
    constructor(private httpClient: HttpClient) { }

    private handleError(errorResponse: HttpErrorResponse){
        console.log(errorResponse); 
       return throwError( errorResponse.error); 
    }

    FeedbackForm:FormGroup = new FormGroup({
        name: new FormControl(null),
        email: new FormControl(null, [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        comment: new FormControl(null, Validators.required),
        file: new FormControl(null),
        fileExtension: new FormControl(null)
    });

    /*export(download_endpoint) {
        return this.httpClient.get(download_endpoint, {responseType: 'blob'}).pipe(catchError(this.handleError));
    }*/

    /*activate_account(userId: string):Observable<any>{ 
        return this.httpClient.get(environment.baseUrl + 'api/Account/ActivateAccountByUserId?UserId=' + userId).pipe(catchError(this.handleError));
    }*/

    register(model:any): Observable<any> { console.log(model);
        return this.httpClient.post(environment.baseUrl + 'api/auth/register', model).pipe(catchError(this.handleError));
    } 

    activateAccount(payload:any): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + `api/auth/activate/${payload.userId}?token=${payload.token}`).pipe(catchError(this.handleError));
    } 

    //change
    resetPassword(passModel:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/applicant/passwordchange', passModel).pipe(catchError(this.handleError));
    }
    
    //reset
    changePassword(payload:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'api/auth/reset-password', payload).pipe(catchError(this.handleError));
    }

    forgotPassword(email:string): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'api/auth/reset-password', {userName: email}).pipe(catchError(this.handleError));
    }

    uploadApplicantImage(imageFile:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/applicant/imageupload ', imageFile).pipe(catchError(this.handleError));//
    } 

    profilePicture(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant/profilepicture').pipe(catchError(this.handleError));
    }

    sendFeedback(feedback:any): Observable<any> { console.log(feedback)
        return this.httpClient.post(environment.baseUrl + 'ajira/comment/save', feedback).pipe(catchError(this.handleError));
    }

    
    //Alerts
    subscriptionCategories(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/subscription-category').pipe(catchError(this.handleError));
    }
    
    subscribe(subscribedCategories:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/subscription', subscribedCategories).pipe(catchError(this.handleError));
    }

    subscribedCategories(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant-subscription').pipe(catchError(this.handleError));
    }

    /*unsubscribeCategory(categoryId:number): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/unsubscribe-category/' + categoryId, {}).pipe(catchError(this.handleError));
    }*/

    unsubscribeCategory(payload:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/unsubscribe-category/', payload).pipe(catchError(this.handleError));
    }

}






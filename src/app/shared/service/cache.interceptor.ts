import { Injectable, Inject } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { StorageService, SESSION_STORAGE } from "angular-webstorage-service";
import { HttpCacheService } from "./cache.service";
import { tap } from 'rxjs/operators';
import { of } from "rxjs";



@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    constructor(private cacheService: HttpCacheService){ }

    intercept(req: HttpRequest<any>,  next: HttpHandler):Observable<HttpEvent<any>> { 
        //if(req.method.indexOf('POST')< 0 && req.url.indexOf('AuthorizeCard') < 0 &&  req.url.indexOf('GetPostedFolio') < 0 &&  req.url.indexOf('ClaimRegistrationSelectAll') < 0 && req.url.indexOf('GetFoliosByClaimNo') < 0 && req.url.indexOf('GetPackageItemTypes') < 0 &&  req.url.indexOf('GetApprovalRequestsByDateRange') < 0 &&  req.url.indexOf('SearchApproval') < 0 && req.url.indexOf('GetPostedForm2c') < 0 ) 
        if(req.method.indexOf('POST')< 0 && req.url.indexOf('Lookups') >= 0 )   
        {   
            const cachedResponse = this.cacheService[req.urlWithParams] || null; //call get method
            if(cachedResponse){
                console.log("response from cache interceptor!"); 
                return of(cachedResponse);
            }
        }
        
        return next.handle(req).pipe( tap(event=>{ 
            if(event instanceof HttpResponse){
                this.cacheService[req.urlWithParams] = event; //call set method
                console.log('Response from server!');
            }
        }));
    }
  
}
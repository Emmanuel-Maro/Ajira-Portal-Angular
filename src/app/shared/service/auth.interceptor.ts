import { Injectable, Inject } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { StorageService, SESSION_STORAGE, LOCAL_STORAGE } from "angular-webstorage-service";
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';
import { AuthService } from "./auth.service";
import { MatDialog } from "@angular/material";
import { of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router, private authService:AuthService, private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>,  next: HttpHandler):Observable<HttpEvent<any>> { console.log(req.url);

        if(req.url.indexOf("/auth/login") >= 0){ 
            return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        if(req.url.indexOf("/auth/activate") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
      }
        if(req.url.indexOf("/ajira/public/vacancies") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        if(req.url.indexOf("/ajira/public/vacancy-details") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        if(req.url.indexOf("/auth/register") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        if(req.url.indexOf("/auth/reset-password") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        else if(req.url.indexOf("assets/i18n/") >= 0){ 
          return next.handle(req).pipe(catchError(x=> this.handleAuthError(x)));
        }
        else { 
              if(this.storage.get('tokenParams')){ 
                  var authHeader = 'Bearer ' + this.storage.get('tokenParams').access_token ;
                  const authReq = req.clone({
                    headers: new HttpHeaders({
                      'Content-Type':  'application/json',
                      'Authorization': authHeader
                    })
                  });
                  return next.handle(authReq).pipe(catchError(x=> this.handleAuthError(x)));//pass to next the next immediate interceptor 
              } 
        }
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> { 
      //handle your auth error or rethrow
      if (err.status === 401 || err.status === 403) {
          //navigate /delete cookies or whatever
          this.router.navigateByUrl(`/login`);
          // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
          return of(err.message); // or EMPTY may be appropriate here
      }
      return throwError(err);
  }
}

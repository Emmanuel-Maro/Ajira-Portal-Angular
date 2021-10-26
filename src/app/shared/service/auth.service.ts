/*
import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, } from "rxjs/operators"

import { StorageService, SESSION_STORAGE, LOCAL_STORAGE } from "angular-webstorage-service";
import { environment } from "../../../environments/environment";
import { TokenParams } from "../../models/token-params";



@Injectable()
export class AuthService{
    tokenParams:TokenParams;
    isAuthenticated:boolean;

    private tokenApi = environment.baseUrl +'Token';
    constructor(private httpClient:HttpClient, @Inject(LOCAL_STORAGE) private localStorage: StorageService  ){ }

    
    private handleError(errorResponse: HttpErrorResponse){
      console.log(errorResponse);
      return throwError(errorResponse); 
    }
    
    login(username:string, password:string):Observable<TokenParams>{
        var headersForTokenApi = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        var data = "grant_type=password&username=" + username + "&password=" + password; 

        return this.httpClient.post<TokenParams>(this.tokenApi, data).pipe(catchError(this.handleError));
    }

    isLoggedIn() :boolean { 
    //console.log(this.storage.get('tokenParams') || 'LocaL storage is empty');
     //var tokenParams = this.storage.get('tokenParams');
     // return this.storage.get('tokenParams') ? true: false;
     return false;
    }

    logout() { 
      this.localStorage.remove('access_token');
      this.localStorage.remove('tokenParams');
      console.log('localstorage remove access_token...');
      this.isAuthenticated = false;
    }

    hasRole(role:string):boolean{
      var tokenParams = this.localStorage.get('tokenParams');
      var roles = JSON.parse(tokenParams.roles);
      let flag:boolean = false; 
      roles.forEach((_role, index) => {
        if(_role.indexOf(role) > -1) {
          flag = true;
          return;
        }
      });
      return flag;
    }
}

*/

import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, } from "rxjs/operators"
import jwt_decode from 'jwt-decode';
import { StorageService, LOCAL_STORAGE } from "angular-webstorage-service";
import { environment } from "../../../environments/environment";
import { TokenParams } from "../../models/token-params";



@Injectable()
export class AuthService{
    tokenParams:TokenParams;
    isAuthenticated:boolean;

    private tokenApi = environment.baseUrl +'token';
    constructor(private httpClient:HttpClient, @Inject(LOCAL_STORAGE) private localStorage: StorageService  ){ }

    
    private handleError(errorResponse: HttpErrorResponse){
      console.log(errorResponse);
      return throwError(errorResponse); 
    }
    
    login(username:string, password:string):Observable<TokenParams>{
      //const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        //var data = "username" + username + "&password=" + password; 
        return this.httpClient.post<TokenParams>(environment.baseUrl + 'api/auth/login' , {'username':username, 'password': password})
    }

    isLoggedIn() :boolean { 
      //console.log(this.storage.get('tokenParams') || 'LocaL storage is empty');
      this.tokenParams = this.localStorage.get('tokenParams');
      if(this.tokenParams){
        //let decoded_token_parts:any = jwt_decode(this.localStorage.get('tokenParams').access_token);  
        //let now_time_seconds =  new Date( Date.now() ).getTime(); //seconds
        //let exp_time_seconds = new Date(decoded_token_parts.exp * 1000).getTime(); 
        //if(exp_time_seconds < now_time_seconds ){   console.log('kaka');
           // this.isAuthenticated = false;
            //return false;
       //}
       // else {
          this.isAuthenticated = true;
          return true;
        //}
      }
      else {
        this.isAuthenticated = false;
        return false;
      }
      
    }

    logout() { 
      this.localStorage.remove('access_token');
      this.localStorage.remove('tokenParams');
      console.log('localstorage remove access_token...');
      this.isAuthenticated = false;
    }


    hasRole(role:string):boolean{
      var tokenParams = this.localStorage.get('tokenParams');
      var roles = JSON.parse(tokenParams.roles);
      let flag:boolean = false; 
      roles.forEach((_role, index) => {
        if(_role.indexOf(role) > -1) {
          flag = true;
          return;
        }
      });
      return flag;
    }

    getToken(): TokenParams{
      return this.localStorage.get('tokenParams');
    }
}

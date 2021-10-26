import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService, @Inject(LOCAL_STORAGE) private storage: StorageService){
    
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean { // Observable<boolean> | Promise<boolean> |
      if(this.authService && !!this.storage.get('tokenParams')){
       // let decoded_token_parts:any = jwt_decode(this.storage.get('tokenParams').access_token);  
        //let now_time_seconds =  new Date( Date.now() ).getTime(); //seconds
        //let exp_time_seconds = new Date(decoded_token_parts.exp * 1000).getTime(); //seconds
        //console.log(now_time_seconds); console.log(exp_time_seconds);
        //f(exp_time_seconds < now_time_seconds ){
         // this.router.navigate(['login',{next:state.url}], { state: {redirectUrl: state.url} });
          return true;
        //}
       // else return true;
      }
      else {
        //this.router.navigate(['login']);
        this.router.navigate(['login',{next:state.url}], { state: {redirectUrl: state.url} });//ok
        //this.router.navigate(['/login',{next:state.url}]); //state.url is the requested url
        return false;
      }
  }

  


}

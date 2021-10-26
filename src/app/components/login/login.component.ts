
import { Component, AfterViewInit, OnInit,  Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TokenParams } from '../../models/token-params';
import { NgxPermissionsService } from 'ngx-permissions';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../../shared/service/data.service';
import jwt_decode from 'jwt-decode';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    tokenParams:TokenParams;
    hidePassword:boolean = true;
    status:string = '';
    loginError:any = {};
    state:any = {} ;
    showProgressBar:boolean = false;
    constructor(private formBuilder: FormBuilder, private router:Router, private route: ActivatedRoute, private authService:AuthService, private spinner: NgxSpinnerService,
        @Inject(LOCAL_STORAGE) private storage: StorageService,  private dataService: DataService, private permissionsService: NgxPermissionsService){
          this.route.queryParamMap.subscribe((data:any) => { 
            this.status = data.params.status;
        });
 
        
    }

    ngOnInit(): void { 
      this.state =  history.state ? history.state : null;
      this.tokenParams = new TokenParams();
      this.loginForm = this.formBuilder.group({
          username: ['', [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          password: ['',[Validators.required]]});
    }

    ngAfterViewInit(): void {
     
    }

      
  login() { 
    if (this.loginForm.valid) {
       //this.spinner.show();
       this.showProgressBar = true;
        this.status = null;
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((response:any) => { 
          this.showProgressBar = false;
          //this.spinner.hide();
          this.tokenParams.access_token = response.accessToken;
          this.tokenParams.userId = response.id;

          let decoded_token_parts:any = jwt_decode(this.tokenParams.access_token);
          //this.tokenParams.expires_in = decoded_token_parts.exp;//temporary disabled
          this.tokenParams.expires_in = 60;
          this.tokenParams.userName = decoded_token_parts.sub;
          console.log(this.tokenParams);
          this.authService.tokenParams = this.tokenParams;
          this.authService.isAuthenticated = true;
          this.storage.set('tokenParams', this.tokenParams);
          this.dataService.changeData({'userName': this.tokenParams.userName});
          if(history.state && history.state.redirectUrl)
            this.router.navigate([history.state.redirectUrl]);
          else this.router.navigate(['/applicant/dashboard']);
      
      }, errorResponse=>{ 
        console.log(errorResponse);
        this.showProgressBar = false;
        //this.spinner.hide();
        if(errorResponse.status === 401){ 
          this.loginError.error_description = "Username or password is incorrect!";
        }
        else if(errorResponse.error.message){
          this.loginError.error_description = errorResponse.error.message; 
        }
 
      });
    }

  } 

}
import { OnInit, Component, ViewChild, OnDestroy, ChangeDetectorRef, Inject } from "@angular/core";
import { MatDialog, MatDialogConfig, MatSnackBar} from "@angular/material";
import { Router } from "@angular/router";
import { LOCAL_STORAGE, StorageService } from "angular-webstorage-service";
import * as _ from 'lodash';
import { TokenParams } from "../../models/token-params";
import { AuthService } from "../../shared/service/auth.service";
import { ApplicantService } from "../service/applicant.service";

@Component({
    templateUrl: './applicant-dashboard.component.html',
    styleUrls: ['./applicant-dashboard.component.css'],

  })

  export class ApplicantDashboardComponent implements OnInit, OnDestroy {
    tokenParams:TokenParams;
    userName:string = null;
    profileCompleteness:number;
    color:string= "warn";
    firstLevelTimer:number = 125;
    secondLevelTimer:number = 1;
    idleTimerLeft: string;
    secondTimerLeft: string;
    timeRemain: number;
    FULL_DASH_ARRAY = 283;


      constructor(private applicantService: ApplicantService, private authService: AuthService, private changeDetectorRef:ChangeDetectorRef, 
        @Inject(LOCAL_STORAGE) private storage: StorageService, private router:Router, private dialog: MatDialog, private snackBar: MatSnackBar){
        this.applicantService.profilecompleteness().subscribe(result=>{
          this.profileCompleteness = result.data;
          if(this.profileCompleteness < 50)
            this.color = "warn";
          else  this.color="primary"
          this.changeDetectorRef.detectChanges();
        });
      }

      ngOnDestroy(): void {
        console.log('on destroy method called');
      }

      ngOnInit(): void {
        this.tokenParams = this.storage.get('tokenParams');
        if(this.tokenParams && this.tokenParams.userName){
          this.userName = this.tokenParams.userName;
          this.changeDetectorRef.detectChanges();
        }
      }

  }
  
  
import { OnInit, Component, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatMenuTrigger, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource} from "@angular/material";
import * as _ from 'lodash';
import * as pdfMake from  'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { DatePipe } from "@angular/common";
import { ApplicantService } from "../service/applicant.service";
import { DialogService } from "../../shared/service/dialog.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppService } from "../../shared/service/app.service";
import { environment } from '../../../environments/environment';
import { AuthService } from "../../shared/service/auth.service";
import { TokenParams } from "../../models/token-params";
@Component({
    templateUrl: './cv-preview.component.html',
    styleUrls: ['./cv-preview.component.css'],
    
  })

  export class CVPreviewComponent implements OnInit {
    datePipe = new DatePipe('en-US');
    tokenParam:any = {};
      imagePath:string ;
      applicantDetails:any = {};
      horizontalPosition: MatSnackBarHorizontalPosition = 'right';
      verticalPosition: MatSnackBarVerticalPosition = 'top';

      constructor(private applicantService: ApplicantService, private dialog: MatDialog, private snackBar: MatSnackBar,private appService: AppService,
         private changeDetectorRef:ChangeDetectorRef, private dialogService: DialogService, private authService:AuthService, private spinner: NgxSpinnerService){
          this.tokenParam = this.authService.getToken();
          this.appService.profilePicture().subscribe(result=>{ 
            this.imagePath = environment.attachmentBaseUrl +  result.data.profile;
            this.changeDetectorRef.detectChanges();
         },errorResponse=>{
           this.imagePath = 'assets/images/user.png';
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
        }); 

        this.applicantService.getPersonalDetails().subscribe(result => { 
            this.applicantDetails.personalDetails = result.data; 
            this.changeDetectorRef.detectChanges(); console.log(this.applicantDetails.personalDetails)
          },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
        });

        this.applicantService.contactDetails().subscribe(result => { 
          this.applicantDetails.contactDetails = result.data[0];
        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
      });

      this.getLanguageProficiency();
      this.getAcademicQualifications();
      this.getProfessionalQualifications();
      this.getWorkingExperience();
      this.getReferees();
      this.getComputerLiteracy();
      this.getTraining();
      }

      ngOnInit(): void {    

      }

      getLanguageProficiency():void{
        this.applicantService.languages().subscribe(result =>{
          this.applicantDetails.languageProficiency = result.data;
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.data)
            this.dialogService.openAlertDialog("Error", errorResponse.data, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      })
      }

      getAcademicQualifications():void{
        this.applicantService.academicQualifications().subscribe(result=> {
          this.applicantDetails.academicQualifications = result.data;
          this.changeDetectorRef.detectChanges();
          //console.log(this.applicantDetails);
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.openSnackBar(errorResponse.message, "warning-snackbar");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
      }

      getProfessionalQualifications():void{
        this.applicantService.professionalQualifications().subscribe(result => { 
          this.applicantDetails.professionalQualifications =  result.data || [];
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.openSnackBar(errorResponse.message, "warning-snackbar");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
      }

      getWorkingExperience():void{
        this.applicantService.workingExperience().subscribe(result => {
          this.applicantDetails.workingExperience = result.data || [];
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
        });
      }

      getReferees():void{
        this.applicantService.referees().subscribe(result => { 
          this.applicantDetails.referees = result.data || [];
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
        });
      }

      getComputerLiteracy():void{
        this.applicantService.computerLiteracy().subscribe(result=> { 
          this.applicantDetails.computerLiteracy = result.data || [];
          this.changeDetectorRef.detectChanges();
        },errorResponse=>{
          console.log(errorResponse);
          if(errorResponse && errorResponse.message)
            this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
          else {
            this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
          } 
      });
      }

      getTraining():void{
        this.applicantService.training().subscribe(result => { 
          this.applicantDetails.training = result.data || [];
          this.changeDetectorRef.detectChanges();
       

        },errorResponse=>{
         console.log(errorResponse);
         if(errorResponse && errorResponse.message)
           this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
         else {
           this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
         } 
        });
      }


      translateMaritalStatus(statusId:number): string{
        switch(statusId){
          case 0: return 'Single';
          case 1: return 'Married'
          default: return '';
        }
      }

      translateProficiency(proficiencyId:number): string{
        switch(proficiencyId){
          case 3: return 'Very Good';
          case 2: return 'Good';
          case 1:  return 'Fair';
          default: return '';
        }
      }

      async printCV(printOption:boolean):Promise<void>{ 
        let languageProficieny = [
              [{text: 'Language',  fontSize: 10, bold:true}, {text: 'Speak',  fontSize: 10, bold:true}, {text: 'Read',  fontSize: 10, bold:true}, {text: 'Write',  fontSize: 10, bold:true}],
        ];

        //LANGUAGE PROFICIENCY
        for(var i = 0; i< this.applicantDetails.languageProficiency.length; i++)
        {
          var languages = [];
          languages.push({text: this.applicantDetails.languageProficiency[i].languageName, fontSize: 10});
          languages.push({text: this.translateProficiency(this.applicantDetails.languageProficiency[i].langSpeak), fontSize: 10});
          languages.push({text: this.translateProficiency(this.applicantDetails.languageProficiency[i].langRead), fontSize: 10});
          languages.push({text: this.translateProficiency(this.applicantDetails.languageProficiency[i].langWrite), fontSize: 10});
          languageProficieny.push(languages); 
        }

        //Academic Qualifications
        let academicQualifications = [
          [{text: 'Level',  fontSize: 10, bold:true}, {text: 'Programme',  fontSize: 10, bold:true}, {text: 'Institution',  fontSize: 10, bold:true}, {text: 'Year',  fontSize: 10, bold:true}],
        ];

        for(var i = 0; i< this.applicantDetails.academicQualifications.length; i++)
        {
          var academic = [];
          academic.push({text: this.applicantDetails.academicQualifications[i].level, fontSize: 10});
          academic.push({text: this.applicantDetails.academicQualifications[i].programmeName, fontSize: 10});
          academic.push({text: this.applicantDetails.academicQualifications[i].institutionName || this.applicantDetails.academicQualifications[i].institutionNameOther, fontSize: 10});
          academic.push({text: this.datePipe.transform(this.applicantDetails.academicQualifications[i].dateTo, 'yyyy'), fontSize: 10});
          academicQualifications.push(academic); 
        }

        //PROFESSIONAL Qualifications
        let professionalQualifications = [
          [{text: 'Course',  fontSize: 10, bold:true}, {text: 'Institution',  fontSize: 10, bold:true}, {text: 'Year',  fontSize: 10, bold:true}],
        ];
        for(var i = 0; i< this.applicantDetails.professionalQualifications.length; i++)
        {
          var professional = [];
          professional.push({text: this.applicantDetails.professionalQualifications[i].name || this.applicantDetails.professionalQualifications[i].otherCourseName , fontSize: 10});
          professional.push({text: this.applicantDetails.professionalQualifications[i].institutionName || this.applicantDetails.professionalQualifications[i].otherInstituteName , fontSize: 10});
          professional.push({text: this.datePipe.transform(this.applicantDetails.professionalQualifications[i].endDate, 'yyyy'), fontSize: 10});
          professionalQualifications.push(professional); 
        }

        //Working Experience 
        let workingExperience = [
          [{text: 'Institution/Organization',  fontSize: 10, bold:true}, {text: 'Position',  fontSize: 10, bold:true}, {text: 'From',  fontSize: 10, bold:true}, {text: 'To',  fontSize: 10, bold:true}],
        ];
        for(var i = 0; i< this.applicantDetails.workingExperience.length; i++)
        {
          var experience = [];
          experience.push({text: this.applicantDetails.workingExperience[i].instituteName , fontSize: 10});
          experience.push({text: this.applicantDetails.workingExperience[i].jobTitle , fontSize: 10});
          experience.push({text: this.datePipe.transform(this.applicantDetails.workingExperience[i].dateFrom, 'MMMM yyyy'), fontSize: 10});
          experience.push({text: this.applicantDetails.workingExperience[i].dateTo == null ? 'To date' : this.datePipe.transform(this.applicantDetails.workingExperience[i].dateTo, 'MMMM yyyy'), fontSize: 10});
          workingExperience.push(experience); 
        }

        //TRAININGS AND WORKSHOPS
        let trainingAndWorkshop = [
          [{text: 'Institution/Organization',  fontSize: 10, bold:true}, {text: 'Position',  fontSize: 10, bold:true}, {text: 'From',  fontSize: 10, bold:true}, {text: 'To',  fontSize: 10, bold:true}],
        ];
        for(var i = 0; i< this.applicantDetails.training.length; i++)
        {
          var training = [];
          training.push({text: this.applicantDetails.training[i].trainingName , fontSize: 10});
          training.push({text: this.applicantDetails.training[i].trainingInstitution , fontSize: 10});
          training.push({text: this.datePipe.transform(this.applicantDetails.training[i].startDate, 'MMMM yyyy'), fontSize: 10});
          training.push({text: this.datePipe.transform(this.applicantDetails.training[i].endDate, 'MMMM yyyy'), fontSize: 10});
          trainingAndWorkshop.push(training); 
        }

        //COMPUTER LITERACY
        let computerLiteracy = [
          [{text: 'Program',  fontSize: 10, bold:true}, {text: 'Proficiency',  fontSize: 10, bold:true}],
        ];
        for(var i = 0; i< this.applicantDetails.computerLiteracy.length; i++)
        {
          var literacy = [];
          literacy.push({text: this.applicantDetails.computerLiteracy[i].computerSkillBean , fontSize: 10});
          literacy.push({text: this.translateProficiency(this.applicantDetails.computerLiteracy[i].proficiency) , fontSize: 10});
          computerLiteracy.push(literacy); 
        }

        //REFEREES
        let referees = [
          [{text: 'Name',  fontSize: 10, bold:true}, {text: 'Institution/Organization',  fontSize: 10, bold:true}, {text: 'Title',  fontSize: 10, bold:true}, {text: 'Contacts',  fontSize: 10, bold:true}],
        ];
        for(var i = 0; i< this.applicantDetails.referees.length; i++)
        {
          var referee = [];
          referee.push({text: this.applicantDetails.referees[i].fullName , fontSize: 10});
          referee.push({text: this.applicantDetails.referees[i].refereeOrganization , fontSize: 10});
          referee.push({text: this.applicantDetails.referees[i].refereeTitle , fontSize: 10});
          referee.push({text: 'Mobile: ' + this.applicantDetails.referees[i].telephoneNumber + '\n' + 'Email: ' + this.applicantDetails.referees[i].emailAddress , fontSize: 10}); //rowSpan: 2,
           //referee.push({});  
          referees.push(referee); 
        }

        pdfMake.vfs = pdfFonts.pdfMake.vfs;

       var dd = {
        //pageMargins: [15, 10, 15, 10], //left top right down
        footer: function(currentPage, pageCount) { 
          return [{text:'Page ' + currentPage.toString() + ' of ' + pageCount , alignment:'right' , fontSize:10, bold:true, margin: [0, 0,10, 0] }]; //[left, top, right, bottom]  
        },
        content: [
          { 
            table: { widths: ['60%', '40%'],
                 body: [
                        [
                          //{},
                          {image: await this.getBase64ImageFromURL(this.imagePath), width: 115, height: 115}, 
                          {style: 'tblAddress', table: { widths: ['*'], body: [ [{text: this.applicantDetails.personalDetails.firstName + ' ' + this.applicantDetails.personalDetails.middleName + ' '  + this.applicantDetails.personalDetails.familyName }],[{text: this.applicantDetails.contactDetails.presentAddress}], [{text: this.tokenParam.userName}], [{text: this.applicantDetails.contactDetails.mobileNumber}] ]},layout: 'noBorders'}
                        ],	
                  ]
            },
              layout: 'noBorders'
          },
        {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'PERSONAL DETAILS',  fontSize: 11, bold:true,  fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false],}],
                  ]
          }
        },
        {
          style: 'tbl_bg',
          table: {
                  widths: ['40%',  '60%'],
                  body: [
                    //[{ text: 'Personal Details', colSpan:2, fillColor: '#dedede'}],
                    [{text: 'Date of Birth' , bold:true}, {text: this.datePipe.transform(this.applicantDetails.personalDetails.dateBirth,'dd MMMM yyyy')}],
                    [{text: 'Sex', bold:true}, {text: this.applicantDetails.personalDetails.gender}],
                    [{text: 'Marital Status', bold:true}, {text: this.translateMaritalStatus(this.applicantDetails.personalDetails.maritalStatus)}],
                    [{text: 'Nationality', bold:true}, {text: this.applicantDetails.personalDetails.nationality}],
                    [{text: 'Place of Birth', bold:true}, {text: this.applicantDetails.personalDetails.regionofbirth + ' - ' + this.applicantDetails.personalDetails.districtofbirth}],
                  ]
                  //[[{text:'ItemName', style: 'tableHeader', fillColor: '#dedede'}, {text: 'Quantity', style: 'tableHeader', fillColor: '#dedede'}, {text: 'Unit Price (Tsh)', style: 'tableHeader', fillColor: '#dedede'}, { text: 'Total Price (Tsh)', style: 'tableHeader', fillColor: '#dedede'}, { text: 'Paid By NHIF(Tsh)', style: 'tableHeader', fillColor: '#dedede'}]];
          }
        },
        //Language Proficiency
        {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'LANGUAGE PROFICIENCY',  fontSize: 11, bold:true,  fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false],}],
                  ]
          }
        },
        {
          table: {
                  widths: ['40%', '*', '*', '*'],
                  body: languageProficieny
          }
        },
        //ACADEMIC QUALIFICATIONS
        {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'ACADEMIC QUALIFICATIONS',  fontSize: 11, bold:true,  fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false],}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*', '*', '10%'],
                  body: academicQualifications
          }
        },
        
        //PROFESSIONAL QUALIFICATIONS
        {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'PROFESSIONAL QUALIFICATIONS',  fontSize: 11, bold:true,  fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false]}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*', '10%'],
                  body: professionalQualifications,
          }
        },
        //{text: '', pageBreak: 'after'},
        //Working Experience
        {
          margin: [0, 25, 0, 0],
          table: {
                  dontBreakRows: true,
                  widths: ['*'],
                  body: [
                    [{text: 'WORKING EXPERIENCE',  fontSize: 11, bold:true, fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false]}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*', '12%', '12%'],
                  body: workingExperience
          }
        },
         
        //TRAININGS AND WORKSHOPS
        {
          
          margin: [0, 25, 0, 0],
          table: {
            dontBreakRows: true, 
                  widths: ['*'],
                  body: [
                    [{text: 'TRAININGS AND WORKSHOPS',  fontSize: 11, bold:true, fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false]}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*', '14%', '14%'],
                  body: trainingAndWorkshop
          }
        },

        //COMPUTER LITERACY
        {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'COMPUTER LITERACY',  fontSize: 11, bold:true, fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false]}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*'],
                  body: computerLiteracy
          }
        },

         //REFEREES
         {
          margin: [0, 25, 0, 0],
          table: {
                  widths: ['*'],
                  body: [
                    [{text: 'REFEREES',  fontSize: 11, bold:true, fillColor: '#0f749d', color:'#ffffff', border: [true, true, true, false]}],
                  ]
          }
        },
        {
          table: {
                  widths: ['*', '*', '*', '*'],
                  body: referees
          }
        },

        {
          
          text: 'I declare that the information provided is complete and correct to the best of my knowledge. I understand that any false information supplied could lead to my application being disqualified or my discharge if I am appointed.',
          margin: [0, 25, 0, 0],
        }


        
        ],  //end of content
        styles: {
          tblAddress: {
            alignment: 'left',
            fontSize: 11,
            color: '#252121',
            bold:true
          },
          tbl_header: {
            fontSize: 10,
            margin: [0, 25, 0, 0]
          },

          tbl_bg: {
            fontSize: 10,
            margin: [0, 0, 0, 0]
          },
        },
       }

      if(printOption){
        var win = window.open('./waiting.html', '_blank');
        pdfMake.createPdf(dd).open({}, win);   
        //pdfMake.createPdf(dd).open();
      }
      else pdfMake.createPdf(dd).download();
      }

      getBase64ImageFromURL(url) {
        return new Promise((resolve, reject) => {
          var img = new Image();
          img.setAttribute("crossOrigin", "anonymous");
          img.onload = () => {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
          };
          img.onerror = error => {
            reject(error);
          };
          img.src = url;
        });
      }

     
      openSnackBar(message: string, type:string) {
        this.snackBar.open(message, 'close', {
          duration: 5000,
          panelClass: [type],
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
      }
      
  }
  
  
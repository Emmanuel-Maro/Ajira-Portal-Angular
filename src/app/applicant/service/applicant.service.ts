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
export class ApplicantService {
    constructor(private httpClient: HttpClient,  @Inject(LOCAL_STORAGE) private localStorage: StorageService) { }
    
    private handleError(errorResponse: HttpErrorResponse){
        if(errorResponse && errorResponse.status == 401){
            console.log('un authorized..')
        }
        return throwError(errorResponse.error); 
    }

    PersonalDetailsForm:FormGroup = new FormGroup({
        applicantID: new FormControl(null),
        firstName: new FormControl({value : null, disabled:true }, Validators.required),
        middleName: new FormControl({value : null, disabled:true }, Validators.required),
        lastName: new FormControl({value : null, disabled:true }, Validators.required),
        gender: new FormControl({value : null, disabled:true },Validators.required),
        dateOfBirth: new FormControl({value : null, disabled:true }),
        regionOfBirth: new FormControl({value : null, disabled:true }),
        districtOfBirth: new FormControl({value : null, disabled:true }),
        originality: new FormControl(null),
        maritalStatus: new FormControl(null),
        physicalDisability:new FormControl(null),
        inService: new FormControl(null),
    });

    OtherPersonalDetailsForm:FormGroup = new FormGroup({
        originality: new FormControl(null, Validators.required),
        maritalStatus: new FormControl(null, Validators.required),
        inService: new FormControl(null, Validators.required),
        physicalDisability:new FormControl(null, Validators.required),


    });

    ContactDetailsForm:FormGroup = new FormGroup({
        contactAddressId: new FormControl(null),
        region: new FormControl(null), //dynamically set Validators.required
        district: new FormControl(null), //dynamically set Validators.required
        alternativeEmail: new FormControl(null, [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        countryResidence: new FormControl(null, Validators.required),
        stateCity: new FormControl(Validators.required), //dynamically set Validators.required
        countyProvince: new FormControl(Validators.required), 
        mobileNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
        boxNo: new FormControl(), //dynamically set Validators.required
        presentAddress: new FormControl(null), //dynamically set Validators.required
    });

    NidaInfoRequestForm:FormGroup = new FormGroup({
        nin: new FormControl(null, [Validators.required, Validators.minLength(20), Validators.maxLength(20)]),
        qnAnsw: new FormControl(null,),
        rqCode: new FormControl(null),
    });

    WorkExperienceForm:FormGroup = new FormGroup({
        workingExperienceId: new FormControl(null),
        instituteName: new FormControl(null,Validators.required),
        jobTitle: new FormControl(null, Validators.required),
        dutiesResponsiblities: new FormControl(null),
        immediateSupervisor: new FormControl(null,Validators.required),
        supervisorTelephoneNumber: new FormControl(null,[Validators.required, Validators.minLength(10), Validators.maxLength(13)]),
        supervisorAddress: new FormControl(null),
        dateFrom: new FormControl(new Date(), Validators.required),
        dateTo: new FormControl(new Date()),
        currentJob:new FormControl('N')


    });

    ProfessionalQualificationForm:FormGroup = new FormGroup({
        institutionId: new FormControl(null),
        courseId: new FormControl(null),
        countryId: new FormControl(null, Validators.required),
        otherInstituteName: new FormControl(null),
        otherCourseName: new FormControl(null),
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null,Validators.required),
        file: new FormControl(null,[Validators.required]),
        fileExtension: new FormControl(null),
    });

    TrainingForm:FormGroup = new FormGroup({
        trainingId: new FormControl(null),
        trainingName: new FormControl(null, Validators.required),
        trainingDescription: new FormControl(null),
        trainingInstitution: new FormControl(null,Validators.required),
        startDate: new FormControl(null,Validators.required),
        endDate: new FormControl(null, Validators.required),
        file: new FormControl(null),
        fileExtension: new FormControl(null)
    });

    LanguageProficiencyForm:FormGroup = new FormGroup({
        language_name: new  FormControl(null,Validators.required),
        lang_speak: new FormControl(null,Validators.required),
        lang_read: new FormControl(null,Validators.required),
        lang_write: new FormControl(null,Validators.required),
        other_language: new FormControl(null),
    });

    ComputerSkillsForm:FormGroup = new FormGroup({
        computerSkill: new  FormControl(null,Validators.required),
        proficiency: new FormControl(null,Validators.required),
    });

    AcademicQualificationForm:FormGroup = new FormGroup({
        academicId: new FormControl(null),
        levelId: new FormControl(null, Validators.required),
        programmeCategoryId:new FormControl(null),
        programmeId: new FormControl(null, Validators.required),
        countryId: new FormControl(null, Validators.required),
        institutionId: new FormControl(null),
        otherInstitutionName: new FormControl(null),
        //otherProgrammeName:new FormControl(null),
        yearFrom: new FormControl(null, Validators.required),
        yearTo: new FormControl(null, Validators.required),
        indexNumber: new FormControl(null, [Validators.pattern("^(S|P)[0-9]{4}-[0-9]{4}$")]),
        division:new FormControl(null),
        divisionPoints:new FormControl(null),
        meritValue:new FormControl(null),
        gpaPoints:new FormControl(null),
        equivalanceNumber:new FormControl(null, [Validators.pattern("^(EQ)[0-9]{10}")]),
        gpaTotal:new FormControl(null)
       
    });

    RefereeForm:FormGroup = new FormGroup({
        refereeId: new FormControl(null),
        fullName: new FormControl(null, Validators.required),
        refereeTitle: new FormControl(null),
        refereeOrganization: new FormControl(null),
        emailAddress: new FormControl(null, [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        telephoneNumber: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(114)]),
        refereeAddress: new FormControl(null)
    });

    LostAcademicCertificateForm:FormGroup = new FormGroup({
        level: new FormControl(null, Validators.required),
        year: new FormControl(null, Validators.required),
        indexNumber: new FormControl(null, [Validators.required, Validators.pattern("^(S|P)[0-9]{4}-[0-9]{4}$")])
    });

    myApplications(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant/my-applications').pipe(catchError(this.handleError));
    }

    getPersonalDetails(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant/personal-details').pipe(catchError(this.handleError));
    }

    updatePersonalDetails(details:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/applicant/personal-details', details).pipe(catchError(this.handleError));
    }

    //Other Attachments
    getAttachmentList(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/other-attachment-list').pipe(catchError(this.handleError));
    }

    getOtherAttachments(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/other-attachment').pipe(catchError(this.handleError));
    }

    addOtherAttachments(attachment:any): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'ajira/other-attachment/save', attachment).pipe(catchError(this.handleError));
    }

    removeAttachment(attachmentId:number): Observable<any> {
        return this.httpClient.delete(environment.baseUrl + `ajira/other-attachment/delete/${attachmentId}`).pipe(catchError(this.handleError));
    }

    getRegions(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/regions').pipe(catchError(this.handleError));
    }

    getDistricts(regionCode:string): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/ditricts-of-region/' + regionCode).pipe(catchError(this.handleError));
    }
    
    profilecompleteness(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant/profilecompleteness').pipe(catchError(this.handleError));
    }


    //Countries
    countries(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/countries').pipe(catchError(this.handleError));
    }

    //Academic
    academicQualifications(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/academic-qualifications').pipe(catchError(this.handleError));
    }

    addAcademicQualifications(academicQualification:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/academic-qualifications', academicQualification).pipe(catchError(this.handleError));
    }

    updateAcademicQualifications(academicQualification:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/academic-qualifications/' + academicQualification.academicId, academicQualification).pipe(catchError(this.handleError));
    }

    lostAcademicCertificate(payload:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/necta-verification', payload).pipe(catchError(this.handleError));
    }

    //Academic Institutions
    academicInstituions(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/academic-institutions').pipe(catchError(this.handleError));
    }

    //ProfessionalQualifications
    professionalInstitutions(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/professional/institutions').pipe(catchError(this.handleError));
    }

    professionalCourses(institutionId:number): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/professional/qualification/institution/' + institutionId + '/courses').pipe(catchError(this.handleError));
       //return this.httpClient.get(environment.baseUrl + 'ajira/professional/courses').pipe(catchError(this.handleError));
    }

    professionalQualifications(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/professional/qualifications').pipe(catchError(this.handleError));
    }

    deleteProfessionalQualifications(qualificationId:number): Observable<any> { 
        return this.httpClient.delete(environment.baseUrl + 'ajira/professional/qualification/' + qualificationId + '/delete').pipe(catchError(this.handleError));
    }

    addProfessionallQualifications(qualification:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/professional/qualification/save', qualification).pipe(catchError(this.handleError));
    }

    academicLevels(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/academic-levels').pipe(catchError(this.handleError));
    }

    academicProgrammes(levelId:number): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/academic-programmes/level/' + levelId).pipe(catchError(this.handleError));
    }

    //ContactDetails
    contactDetails(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/contact-details').pipe(catchError(this.handleError));
    }

    addContactDetails(contactDetails:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/contact-details', contactDetails).pipe(catchError(this.handleError));
    }

    updateContactDetails(contactDetails:any): Observable<any> { console.log(contactDetails)
        return this.httpClient.put(environment.baseUrl + `ajira/contact-details/${contactDetails.contactAddressId}/update`, contactDetails).pipe(catchError(this.handleError));
    }

    ///

    //Working Experience
    workingExperience(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/working-experience').pipe(catchError(this.handleError));
    }

    addWorkingExperience(workingExperience:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/working-experience/save', workingExperience).pipe(catchError(this.handleError));
    }

    updateWorkingExperience(workingExperience:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + `ajira/working-experience/${workingExperience.workingExperienceId}/update`, workingExperience).pipe(catchError(this.handleError));
    }

    removeWorkingExperience(workingExperienceId: number): Observable<any> { 
        return this.httpClient.delete(environment.baseUrl + `ajira/working-experience/${workingExperienceId}/delete`).pipe(catchError(this.handleError));
    }

     //Referees
     referees(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/referees').pipe(catchError(this.handleError));
    }

    addReferee(referee:any): Observable<any> {
        return this.httpClient.post(environment.baseUrl + 'ajira/save-referee', referee).pipe(catchError(this.handleError));
    }

    updateReferee(referee:any): Observable<any> {
        return this.httpClient.put(environment.baseUrl + `ajira/referee/${referee.refereeId}/update`, referee).pipe(catchError(this.handleError));
    }

    removeReferee(refereeId:number): Observable<any> {
        return this.httpClient.delete(environment.baseUrl + `ajira/referees/${refereeId}`).pipe(catchError(this.handleError));
    }

    //Training
    training(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant/trainings').pipe(catchError(this.handleError));
    }

    //Computer-Skills
    computerSkills(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/computer-skills').pipe(catchError(this.handleError));
    }

    computerLiteracy(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/computer-literacy').pipe(catchError(this.handleError));
    }

    addComputerSkill(skill:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/computer-literacy/save', skill).pipe(catchError(this.handleError));
    }

    removeComputerSkill(computerLiteracyId:number){
        return this.httpClient.delete(environment.baseUrl + 'ajira/computer-literacy/' + computerLiteracyId).pipe(catchError(this.handleError));
    }

    addTraining(training:any): Observable<any> { console.log(training)
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/training/save', training).pipe(catchError(this.handleError));
    }

    updateTraining(training:any): Observable<any> { 
        return this.httpClient.put(environment.baseUrl + 'ajira/applicant/training/' + training.trainingId + '/update', training ).pipe(catchError(this.handleError));
    }

    deleteTraining(trainingId:number): Observable<any> { 
        return this.httpClient.delete(environment.baseUrl + 'ajira/applicant/training/' + trainingId + '/delete').pipe(catchError(this.handleError));
    }


    languages(): Observable<any> { 
        return this.httpClient.get(environment.baseUrl + 'ajira/applicant-language').pipe(catchError(this.handleError));
    }

    addLanguage(language:any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant-language', language).pipe(catchError(this.handleError));
    }

    deleteLanguage(id:number): Observable<any> {
        return this.httpClient.delete(environment.baseUrl + 'ajira/applicant-language/' + id).pipe(catchError(this.handleError));
    }
    
    submitRequest(serviceAuthorization: ServiceAuthorization) { 
        return this.httpClient.post(environment.baseUrl + 'api/Approval/RequestApproval', serviceAuthorization).pipe(catchError(this.handleError));
    }

    //Nida
    ninQuestions(request: any) { 
        return this.httpClient.post(environment.baseUrl + 'ajira/nida/questions', request).pipe(catchError(this.handleError));
    }

    //Declaration
    declaration(payload: any): Observable<any> { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/declare', {}).pipe(catchError(this.handleError));
    }

    isDeclared():Observable<any>{
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/isdeclared', {}).pipe(catchError(this.handleError));
    }

    //apply
    apply(payload: any) { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/apply', payload).pipe(catchError(this.handleError));
    }

    editApplication(payload: any) { 
        return this.httpClient.post(environment.baseUrl + 'ajira/applicant/edit-application', payload).pipe(catchError(this.handleError));
    }



}
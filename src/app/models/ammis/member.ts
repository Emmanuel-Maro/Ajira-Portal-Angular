

export class Member {

    constructor(){
        //this.AuthorizedItems = new Array<AuthorizedItem>();
        //this.ApprovalDiseases =  new Array<ApprovalDisease>();
    }
    EmployerName:string;
    MembershipNo:number;
    FirstName:string;
    Middle:string;
    LastName:string;
    FullName:string;
    MaritalStatus:string;
    Gender:string;
    DateOfBirth:Date;
    CategoryName: string;
    IsVerified:string;
    IsActive: string;
    DateOfJoiningEmployer:Date;
    DateOfJoiningFund:Date;
    RecruitingOfficeCode:string;
    PostalAddress:string;
    LatestContributionMonth:string;
    TelephoneMobile:string;
    EmailAddress:string;

    //AuthorizedItems: Array<AuthorizedItem>;
    //ApprovalDiseases: Array<ApprovalDisease>;

    CreatedBy:string;
    DateCreated:Date;
    LastModified:Date;
    LastModifiedBy:string;

}



: new FormControl(''),
: new FormControl(''),
: new FormControl(''),
: new FormControl(''),
: new FormControl(null),
: new FormControl('')
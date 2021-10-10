
 export class UserAccount {
    constructor(){
        this.Roles = new Array<string>();
     }
    Id :string;
    UserName:string;
    Email:string;
    Password :string;
    ConfirmPassword :string;
    FullName :string; 
    CountryID:number;
    CountryName:string;
    Mobile :string; 
    IsActive:boolean;
    DateCreated:Date ;
    Roles: Array<string>;
} 
  
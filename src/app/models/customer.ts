
export class Customer{
    constructor(id:number, fn:string, ln:string, gen:string , dob:Date){
        this.id = id;
        this.firstName = fn;
        this.lastName = ln;
        this.gender = gen;
        this.dateOfBirth = dob;
    }

    id:number;
    firstName:string;
    lastName:string;
    gender:string;
    dateOfBirth:Date;
}
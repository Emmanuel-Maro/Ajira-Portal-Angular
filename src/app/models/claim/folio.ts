import { FolioItem } from "./folio-item";
import { FolioDisease } from "./folio-disease";

export class Folio {

    constructor(){
        this.FolioItems = new Array<FolioItem>();
        this.FolioDiseases =  new Array<FolioDisease>();
    }

    ClaimNo:string;
    FacilityCode:string;
    FolioID:string;
    FolioNo:number;
    ClaimYear:number;
    ClaimMonth:number;
    CardNo:string;
    ProductCode:string;
    SchemeID:number;
    FirstName:string;
    LastName:string;
    Gender:string;
    DateOfBirth:Date;
    TelephoneNo:string;
    AuthorizationNo:string;
    SourceAuthorizationNo:string;
    AttendantID: number;
    PatientFileNo: string;
    SourceDocumentNo:string;
    SerialNo:string;
    PatientTypeCode: string;
    DateAdmitted: Date;
    DateDischarged:Date;
    RegistrationNo:string;
    PractitionerID: number;
    PractitionerName: string;
    QualificationID: number;
    FormType:string;
    AttendanceDate:Date;
    DispensingDate:Date;
    PatientFile:string;
    ClaimFile:string;
    IsSubmitted:boolean;
    AmountClaimed:number;
    
    //PrescriberMobileNo:string;
    //PrescriptionDate:Date;
    SourceFacilityCode:string;
    //DispenserRegistrationNo:string;
    //DispensingDate:Date;

    FolioItems: Array<FolioItem>;
    FolioDiseases: Array<FolioDisease>;

    CreatedBy:string;
    DateCreated:Date;
    LastModified:Date;
    LastModifiedBy:string;
}
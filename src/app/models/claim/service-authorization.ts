
import { ApprovalDisease } from "./approval-disease";
import { ApprovalSupportingDocument } from "./approval-supporting-document";
import { AuthorizedItem } from "./authorized-item";

export class ServiceAuthorization {

    constructor(){
        this.AuthorizedItems = new Array<AuthorizedItem>();
        this.ApprovalDiseases =  new Array<ApprovalDisease>();
        this.ApprovalSupportingDocuments =   new Array<ApprovalSupportingDocument>();
    }
    ServiceAuthorizationID:string;
    ServiceTypeID:number;
    CardNo:string;
    ProductCode:string;
    SchemeID:number;
    FirstName:string;
    LastName:string;
    Gender:string;
    DateOfBirth:Date;
    TelephoneNo:string;
    AuthorizationNo:string;
    FacilityPatientFileNumber: string;
    PractitionerNo:string;
    PrescribedBy: string;
    QualificationID:number;
    AttendanceDate:Date;
    ServiceDate:Date;
    ExpiryDate:Date;
    SourceFacilityCode:string;
    IssuingFacilityCode:string;
    ApprovalIssuingFacilityCode:string;
    PrescribeClinicalNotes:string;
    ClinicalNotes:string;

    AuthorizedItems: Array<AuthorizedItem>;
    ApprovalDiseases: Array<ApprovalDisease>;
    ApprovalSupportingDocuments: Array<ApprovalSupportingDocument>;

    CreatedBy:string;
    DateCreated:Date;
    LastModified:Date;
    LastModifiedBy:string;

}
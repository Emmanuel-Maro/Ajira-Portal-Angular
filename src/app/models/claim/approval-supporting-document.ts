
export class ApprovalSupportingDocument {
    constructor(){
        this.DateCreated = new Date();
     }

    SupportingDocumentID:string;
    ServiceAuthorizationID :string;
    DocumentTypeID:number;
    DocumentType:string;
    DocumentDetails:string;
    DocumentData:string;
    FileType:string;
    DateCreated:Date;

} 
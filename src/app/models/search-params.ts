

 export class SearchParams {
    constructor(){ }
    PartCategoryID:number;
    MakeID:number = -1; 
    ModelID:number = -1;
    ModelCodeID:number = -1;
    BodyTypeID:number = -1;
    SteeringID:number = -1;
    FuelTypeID:number = -1;
    TransmissionID:number = -1;
    DriveTypeID:number = -1;
    ColorID:number = -1;
    SubBodyTypeID:number = -1;
    MinPrice:number = 0;
    MaxPrice:number = 0;
    MinEngineCC:number = -1;
    MaxEngineCC:number = -1;
    YearFrom:number = -1;
    YearTo:number = -1;
    MinMileage:number = -1;
    MaxMileage:number = -1;
    MinSeatNo:number;  
    MaxSeatNo:number;
    LocationStatus:string;
    IsPremierClass:string;
    
} 
  
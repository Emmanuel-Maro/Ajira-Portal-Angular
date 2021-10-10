
import { Component} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataProvider } from "../../shared/service/data-provider";


@Component({
	templateUrl: './registration-success.component.html',
	styleUrls: ['./registration-success.component.css']
})

export class RegistrationSuccessComponent  {
    emailAddress:string;
    constructor(private route:ActivatedRoute, private dataProvider: DataProvider){
        this.route.queryParamMap.subscribe((data:any) => { 
            this.emailAddress = data.params.email;
        });
     }

}
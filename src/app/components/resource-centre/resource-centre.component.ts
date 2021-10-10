
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	templateUrl: './resource-centre.component.html',
	styleUrls: ['./resource-centre.component.css']
})

export class ResourceCentreComponent implements OnInit {
    
    constructor(private router: Router, private spinner: NgxSpinnerService) 
    { 
  
    }
  
    ngOnInit() {

    }

}


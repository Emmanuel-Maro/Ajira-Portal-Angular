
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	templateUrl: './disclaimer.component.html',
	styleUrls: ['./disclaimer.component.css']
})

export class DisclaimerComponent implements OnInit {
    
    constructor(private router: Router, private spinner: NgxSpinnerService) 
    { 
  
    }
  
    ngOnInit() {

    }

}


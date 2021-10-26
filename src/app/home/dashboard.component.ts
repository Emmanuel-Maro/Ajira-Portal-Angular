/*
import { OnInit, Component, ViewChild, Inject } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { TokenParams } from '../models/token-params';
import { AppService } from '../shared/service/app.service';
import jwt_decode from 'jwt-decode';
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";

@Component({
	templateUrl: './advert.component.html',
	styleUrls: ['./advert.component.css']
})

export class AdvertComponent implements OnInit {
    tokenParams: TokenParams;
    loading:boolean = false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    vacanciesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    searchKey:string;

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private appService: AppService){
        
    }

    ngOnInit(): void {
        this.displayedColumns = ['Description', 'ClosingDate' ];
        let data = [{'Post': 'COMMERCIAL ASSISTANT II', 'no_of_post': 4, 'Employer': 'Kigoma Urban Water Supply and Sanitation Authority (KUWASA)', 'ClosingDate': '2021-04-06'},
        {'Post': ' DIRECTOR OF MARITIME SAFETY, SECURITY AND MARINE ENVIRONMENT/REGISTRAR OF SHIPS, SEAFEARERS AND WRECK','no_of_post': 1, 'Employer': 'Tanzania Shipping Agencies Corporation (TASAC)', 'ClosingDate': '2021-04-06'},
        {'Post': 'CURRICULUM COORDINATOR I- (HISTORY)', 'no_of_post': 4 , 'Employer': 'Kigoma Urban Water Supply and Sanitation Authority (KUWASA)', 'ClosingDate': '2021-04-06'}];
        this.vacanciesDataSource.data = data;
        this.vacanciesDataSource._updateChangeSubscription();
    }  

    applyFilter() {
        this.vacanciesDataSource.filter = this.searchKey.trim().toLowerCase();// Remove whitespace//
      }
  
      onSearchClear(){
        this.searchKey = "";
        this.applyFilter();
      }

}

*/
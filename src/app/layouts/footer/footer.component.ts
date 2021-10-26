import { Component } from '@angular/core';
import { DataService } from '../../shared/service/data.service';
import { TokenParams } from '../../models/token-params';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.css']
})
export class AppFooterComponent {
  currentDate :Date = new Date();
  tokenParams:TokenParams;
  data: Observable<any>;
  lookups:any;

  constructor( private dataService: DataService){
      this.dataService.getData$().subscribe(data=>{
        this.lookups = data; 
      });
  }
}

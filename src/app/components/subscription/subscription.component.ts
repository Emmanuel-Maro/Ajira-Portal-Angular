
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher, MatBottomSheet, MatBottomSheetConfig, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from 'lodash';
import { AppService } from "../../shared/service/app.service";
import { DataProvider } from "../../shared/service/data-provider";
import { DialogService } from "../../shared/service/dialog.service";
import { SelectionModel } from "@angular/cdk/collections";

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}
  
@Component({
	templateUrl: './subscription.component.html',
	styleUrls: ['./subscription.component.css']
})

export class SubscriptionComponent implements OnInit {
  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subscribedDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns:string[] = [];
  selection = new SelectionModel<any>(true, []);
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  loading:boolean = true;
  subscriptions: any[] = [];
  categories: any[] = [];
  //subscribed:any[] = [];

    constructor(public appService:AppService, private route: ActivatedRoute, private bottomSheet: MatBottomSheet, private snackBar: MatSnackBar,
      private changeDetectorRef:ChangeDetectorRef, public dialogService: DialogService, private spinner: NgxSpinnerService){ 
        this.getSubscription();
    }
  
    ngOnInit() {
      this.displayedColumns = ['select', 'category', 'subscriptionType', 'actions' ]; 
    }

    getSubscription():void{
      this.loading = true;
      this.appService.subscriptionCategories().subscribe(result=>{
        this.loading= false;
        this.categories = result.data.notSubscribed;
        this.subscribedDataSource.data =  result.data.subcribed;
        this.subscriptions = [];
        this.changeDetectorRef.detectChanges();

      },errorResponse=>{
        this.loading= false;
            console.log(errorResponse);
            if(errorResponse && errorResponse.message)
              this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
            else {
              this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
            } 
        });
    }

    radioChange(name: string, value:number):void{ 
      let category =  _.find(this.categories, {category: name});  
      let index =  _.findIndex(this.subscriptions, {id: category.subscriptionCategoryId}); 

      if(index >= 0)
        this.subscriptions[index] = {'categoryId': category.id, 'subscriptionType': value,  "msisdn": "N/A"};
      else
      this.subscriptions.push({'categoryId': category.id, 'subscriptionType': value,  "msisdn": "N/A"}); 
      

    }

    openBottomSheet(): void {
      /*let config = new MatBottomSheetConfig();
      config.disableClose = true;
      config.autoFocus = true;
      config.data = this.subscribed;
      this.bottomSheet.open(SubscribedCategoriesComponent, config).afterDismissed().subscribe(result=>{

      });*/
    }
    
    subscribe():void{
      this.spinner.show();
      this.appService.subscribe(this.subscriptions).subscribe(result=>{
        this.getSubscription();
        this.openSnackBar("subscription successfully", "success-snackbar");
        this.spinner.hide();
      },errorResponse=>{
        this.spinner.hide();
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
          })
    }

    unSubscribeCategory(row:any):void{ console.log(row)
      this.dialogService.openConfirmDialog("Are you sure you want to unsubscribe: " + row.subscriptionCatName).afterClosed().subscribe(choice =>{
          if(choice){
            let unsubscribedServiceIds = [row.id];
            this.appService.unsubscribeCategory(unsubscribedServiceIds).subscribe(result=>{
              this.getSubscription();
              this.openSnackBar( row.category + " has been unsubscribed successfully", "success-snackbar");
            },errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
            }); 
          }
      });
  }

  unSubscribeSelectedCategories():void{
           this.dialogService.openConfirmDialog("Are you sure you want to unsubscribe all selected categories").afterClosed().subscribe(choice =>{
            if(choice){
              let unsubscribedServiceIds = [];
              this.selection.selected.forEach(element => {
                unsubscribedServiceIds.push(element.id);
              });
              this.appService.unsubscribeCategory(unsubscribedServiceIds).subscribe(result=>{
                this.getSubscription();
                this.openSnackBar("The selected categories have been successfully unsubscribed", "success-snackbar");
              }, errorResponse=>{
              console.log(errorResponse);
              if(errorResponse && errorResponse.message)
                this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
              else {
                this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
              } 
            });
              console.log(unsubscribedServiceIds);
            }
      });
  }

  isAllSelected() { 
    const numSelected = this.selection.selected.length;
    const numRows = this.subscribedDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.subscribedDataSource.data.forEach(row => this.selection.select(row));
  }

  openSnackBar(message: string, type:string) {
    this.snackBar.open(message, 'close', {
      duration: 5000,
      panelClass: [type],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }


}
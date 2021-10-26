/*
import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatBottomSheetRef, MatPaginator, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSort, MatTableDataSource, MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { AppService } from "../../shared/service/app.service";
import { DialogService } from "../../shared/service/dialog.service";
import * as _ from 'lodash';

@Component({
    templateUrl: './subscribed-categories.component.html',
    styleUrls: ['./subscribed-categories.component.css']
  })
  export class SubscribedCategoriesComponent implements OnInit {
    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    selection = new SelectionModel<any>(true, []);
    dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    constructor(public appService:AppService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<SubscribedCategoriesComponent> , 
      private snackBar: MatSnackBar, public dialogService: DialogService) {
      this.dataSource.data = this.data;
      console.log(this.data)


      this.displayedColumns = ['select', 'category', 'subscriptionType', 'actions' ]; 
    }

    ngOnInit(): void {
      this.dataSource.paginator = this.paginator;
    }
  
    unSubscribeCategory(row:any):void{ 
        this.dialogService.openConfirmDialog("Are you sure you want to unsubscribe: " + row.subscriptionCatName).afterClosed().subscribe(choice =>{
            if(choice){
              this.appService.unsubscribeCategory(row.subCatId).subscribe(result=>{
                this.openSnackBar( row.subscriptionCatName + " has been unsubscribed successfully", "success-snackbar");
                let index =  _.findIndex(this.dataSource.data, {subCatId: row.subCatId }); 
                this.dataSource.data.splice(index, 1);
                this.dataSource._updateChangeSubscription();

              },errorResponse=>{
                console.log(errorResponse);
                if(errorResponse && errorResponse.message)
                  this.dialogService.openAlertDialog("Error", errorResponse.message, "error");
                else {
                  this.openSnackBar("an error occurred when try to fetch data from remote server", "warning-snackbar");
                } 
              })
            }
        });
    }

    unSubscribeSelectedCategories():void{
             this.dialogService.openConfirmDialog("Are you sure you want to unsubscribe all selected categories").afterClosed().subscribe(choice =>{
          
        });
    }

    isAllSelected() { 
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }


    masterToggle() {
      this.isAllSelected() ?
          this.selection.clear() :
          this.dataSource.data.forEach(row => this.selection.select(row));
    }
    openLink(event: MouseEvent): void {
      this.bottomSheetRef.dismiss();
      event.preventDefault();
    }
  
    dismiss():void{
      this.bottomSheetRef.dismiss();
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
  
  */
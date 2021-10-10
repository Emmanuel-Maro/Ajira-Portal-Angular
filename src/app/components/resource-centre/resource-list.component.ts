import { OnInit, Component, ViewChild, Inject } from "@angular/core";
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { AttachmentPreviewDialogComponent } from "../../dialog-forms/attachment-preview-dialog.component";
import { VideoPlayerComponent } from "../../dialog-forms/video-player.component";

@Component({
	templateUrl: './resource-list.component.html',
	styleUrls: ['./resource-list.component.css']
})

export class ResourceListComponent implements OnInit {
    loading:boolean = false;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    vacanciesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
    displayedColumns:string[] = [];
    searchKey:string;

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private dialog: MatDialog){
        
    }

    ngOnInit(): void {
        this.displayedColumns = ['Description', 'action' ];
        let data = [{'Title': 'Application General Conditions', 'Url': 'assets/downloads/recruitment-portal-use-guide.pdf', Type:'pdf'},
        {'Title': 'Recruitment Portal User Guide', 'Url': 'assets/downloads/recruitment-portal-user-guide.pdf', Type:'pdf'}, 
        {'Title': 'Ajira za serikali', 'Url': 'assets/downloads/WhatsApp Video 2021-05-28 at 9.29.47 AM.mp4', Type:'video'},];
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

    onPreview(url:string):void{
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      //dialogConfig.width = "80%";
      dialogConfig.height="90%";
      dialogConfig.data = {'attachmentType': 'pdf', 'filePath': url};
      this.dialog.open(AttachmentPreviewDialogComponent, dialogConfig).afterClosed().subscribe(choice=>{ 
       
      });
    }

    onVideoLinkClicked(title, url):void{
      const dialogConfig = new MatDialogConfig();
       dialogConfig.disableClose = false;
       dialogConfig.autoFocus = true;
       dialogConfig.width = "80%";
       dialogConfig.height="90%";
       dialogConfig.data = {'title': title, 'src': url};
       this.dialog.open(VideoPlayerComponent, dialogConfig);
     }
}

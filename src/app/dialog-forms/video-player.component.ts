import { OnInit, Component, ViewChild, Optional, Inject } from "@angular/core";
import {  MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA} from "@angular/material";
import { VgAPI } from "videogular2/compiled/src/core/core";
@Component({
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
  })

  export class  VideoPlayerComponent implements OnInit {
    title:string;
    src:string;
      constructor(private api: VgAPI,public matDialogRef: MatDialogRef<VideoPlayerComponent>,  @Optional() @Inject(MAT_DIALOG_DATA) public data: any ){
        if(this.data){
          this.title = this.data.title;
          this.src = this.data.src;
        }
      }

      ngOnInit(): void {
       
      }

      onPlayerReady(api: VgAPI) {
          this.api = api;
          this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
              this.playVideo.bind(this)
          );
      }
  
      playVideo() { 
        this.api.play();
      }

      onClose(){
        this.matDialogRef.close();
      }

 

  }
  
  
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompareService } from "../compare.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfigService, ImporterCompare, PostInfo} from "../config.service";
import {ConvertService} from "../convert.service";
import {ImportService} from "../import.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private compareService: CompareService,
              private convertSerivce: ConvertService,
              private importService: ImportService,
              private configService: ConfigService) {
    this.route.params.subscribe(params => this.displayCompare(params["id"]));
  }


  ngOnInit() {
  }

  private compare: ImporterCompare = { notImportedPosts: (<PostInfo[]>[])};
  private currentSubscription: Subscription = null;
  private currentShowingID:string;
  private authToken: { token: string } = {token : null};

  displayCompare(id: string) {
    if(this.currentSubscription!=null){
      this.currentSubscription.unsubscribe();
    }
    this.currentShowingID = id;
    this.currentSubscription = this.compareService.getServiceCompare(id).subscribe((compare)=>{
      this.compare = compare;
    });
  }

  async startImport(post: PostInfo) {
    if ("token" in this.authToken) {
      try {
        const convertedDocument = await this.convertSerivce.convertPost(post.id, this.currentShowingID);
        console.log(convertedDocument);
        const config = await this.configService.getServiceConfig().toPromise();
        const result = await this.importService.importDocument(config[ this.currentShowingID ].repository, convertedDocument, this.authToken.token);
        post.importedURL = config[ this.currentShowingID ].repository + "receive" + result.substr(result.lastIndexOf("/"));
      } catch (e) {
        console.error(e);
      }
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompareService } from "../compare.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ConfigService, ImporterCompare, ImporterConfigurationPart, PostInfo} from "../config.service";
import {ConvertService} from "../convert.service";
import {ImportService} from "../import.service";
import {Observable} from "rxjs/internal/Observable";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  public mode: string;


  ngOnInit() {
  }
  private compare: ImporterCompare = {notImportedPosts: (<PostInfo[]>[]), mycoreIDPostMap: {}};
  private postMyCoReKeys = [];
  private currentSubscription: Subscription = null;
  private currentShowingID: string;
  private authToken: { token: string } = {token: null};
  private config: ImporterConfigurationPart = null;

  constructor(private route: ActivatedRoute,
              private compareService: CompareService,
              private convertSerivce: ConvertService,
              private importService: ImportService,
              private configService: ConfigService) {
    this.route.params.subscribe(params => this.displayCompare(params["id"], params["mode"]));
  }
  public error = {error : false, message : ""};

  async displayCompare(id: string, mode: string) {
    if(this.currentSubscription!=null){
      this.currentSubscription.unsubscribe();
    }
    this.currentShowingID = id;
    this.config = (await this.configService.getServiceConfig().toPromise())[this.currentShowingID];

    this.mode = mode;
    this.currentSubscription = this.compareService.getServiceCompare(id).subscribe((compare)=>{
      this.compare = compare;
      this.postMyCoReKeys = Object.keys(compare.mycoreIDPostMap).map(id => [id, compare.mycoreIDPostMap[id]]);
    });
  }

  async startImport(post: PostInfo) {
    if ("token" in this.authToken) {
      try {
        const convertedDocument = await this.convertSerivce.convertPost(post.id, this.currentShowingID);
        console.log(convertedDocument);
        const config = await this.configService.getServiceConfig().toPromise();
        const repositoryURL = config[this.currentShowingID].repository;
        const objectAPIURL = await this.importService.importDocument(repositoryURL, convertedDocument, this.authToken.token);
        const objectID = objectAPIURL.substr(objectAPIURL.lastIndexOf("/")+1);

        post.importedURL = repositoryURL + "receive/" + objectID;

        const pdf = await this.convertSerivce.convertPDF(post.id, this.currentShowingID);
        const derivateAPIURL = await this.importService.importDerivate(repositoryURL, objectID, this.authToken.token);
        const derivateID = derivateAPIURL.substr(derivateAPIURL.lastIndexOf("/")+1);

        await this.importService.importPDF(repositoryURL, objectID, derivateID, pdf.fileName, pdf.blob, this.authToken.token);
      } catch (e) {
        this.error.error = true;
        if ("message" in e) {
          this.error.message = e.message;
        }
        console.error(e);
      }
    }
  }

  async updatePDF(post: PostInfo, objectID: string) {
    if ("token" in this.authToken) {
      const config = await this.configService.getServiceConfig().toPromise();
      const repositoryURL = config[this.currentShowingID].repository;
      const pdf = await this.convertSerivce.convertPDF(post.id, this.currentShowingID);
      const derivateID = await this.importService.getDerivateID(repositoryURL, objectID, this.authToken.token);
      await this.importService.importPDF(repositoryURL, objectID, derivateID, pdf.fileName, pdf.blob, this.authToken.token);
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompareService} from "../compare.service";
import {ConfigService, ImporterCompare, ImporterConfigurationPart, PostInfo} from "../config.service";
import {ConvertService} from "../convert.service";
import {ImportService} from "../import.service";
import {Color, MessageService} from "../message.service";
import {FormControl, FormGroup} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  public mode: string;


  private compare: ImporterCompare = {
    notImportedPosts: (<PostInfo[]>[]),
    mycoreIDPostMap: {},
    mycoreIDValidationMap: {}
  };

  currentShowingID: string;
  authToken: { token: string } = {token: null};
  private config: ImporterConfigurationPart = null;

  filter: FormGroup;
  private name: FormControl;

  private notImported: PostInfo[];
  private postMyCoReKeys = [];
  private warnings: { url: string, warning: string }[] = [];


  constructor(private route: ActivatedRoute,
              private compareService: CompareService,
              private convertSerivce: ConvertService,
              private importService: ImportService,
              private configService: ConfigService,
              private messageService: MessageService,
              private spinnerService: NgxSpinnerService) {
    this.route.params.subscribe(params => this.displayCompare(params["id"], params["mode"]));
  }

  ngOnInit() {
    this.name = new FormControl();

    this.filter = new FormGroup({
      name: this.name
    });
  }

  async displayCompare(id: string, mode: string) {
    this.spinnerService.show();
    this.currentShowingID = id;
    this.config = (await this.configService.getServiceConfig().toPromise())[this.currentShowingID];
    this.mode = mode;

    this.compare = await this.compareService.getServiceCompare(id).toPromise();
    this.filterPosts();

    this.spinnerService.hide();
  }

  async startImport(post: PostInfo) {
    if ("token" in this.authToken) {
      try {
        this.spinnerService.show();
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
        await this.compareService.revalidate(this.currentShowingID, objectID);
        this.spinnerService.hide();
        this.messageService.push({
          message: "Der Blog-Eintrag wurde Erfolgreich importiert!",
          title: "Import Erfolgreich!",
          color: Color.success
        });
      } catch (e) {
        this.spinnerService.hide();
        if ("message" in e) {
          this.messageService.push({message: e.message, title: "Fehler!", color: Color.danger});
        } else {
          this.messageService.push({message: e.toString(), title: "Fehler!", color: Color.danger});
        }
        throw e;
      }
    }
  }

  async downloadPDF(post: PostInfo) {
    try {
      this.spinnerService.show();
      const config = await this.configService.getServiceConfig().toPromise();
      const pdf = await this.convertSerivce.convertPDF(post.id, this.currentShowingID);
      const objectURL = URL.createObjectURL(pdf.blob);
      let link = document.createElement('a');
      link.setAttribute("href", objectURL);
      link.setAttribute("download", pdf.fileName);
      document.body.appendChild(link);
      link.dispatchEvent(new MouseEvent('click', {bubbles : true, cancelable : true, view : window}));
      link.remove();
    } finally {
      this.spinnerService.hide();
    }
  }

  async updatePDF(post: PostInfo, objectID: string) {
    if ("token" in this.authToken) {
      try {
        this.spinnerService.show();
        const config = await this.configService.getServiceConfig().toPromise();
        const repositoryURL = config[this.currentShowingID].repository;
        const pdf = await this.convertSerivce.convertPDF(post.id, this.currentShowingID);
        const derivateID = await this.importService.getDerivateID(repositoryURL, objectID, this.authToken.token);
        await this.importService.importPDF(repositoryURL, objectID, derivateID, pdf.fileName, pdf.blob, this.authToken.token);
        this.spinnerService.hide();
        this.messageService.push({
          message: "Das PDF wurde Erfolgreich geupdated!",
          title: "Update Erfolgreich!",
          color: Color.success
        });
      } catch (e) {
        this.spinnerService.hide();
        if ("message" in e) {
          this.messageService.push({message: e.message, title: "Fehler!", color: Color.danger});
        } else {
          this.messageService.push({message: e.toString(), title: "Fehler!", color: Color.danger});
        }
        throw e;
      }
    }
  }

  filterPosts() {
    const value = <string>this.name.value;
    if (this.compare.mycoreIDValidationMap != null) {
      this.warnings = Object.keys(this.compare.mycoreIDValidationMap).map(key => {
        const objectURL = this.config.repository + "receive/" + key;
        return {url: objectURL, warning: this.compare.mycoreIDValidationMap[key]};
      });
    }
    if (value != null && value.trim().length > 0) {
      const titleFilter = (post) => post.title.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) != -1;
      this.notImported = this.compare.notImportedPosts.filter(titleFilter);
      this.postMyCoReKeys = Object.keys(this.compare.mycoreIDPostMap)
        .sort()
        .reverse()
        .filter(id => titleFilter(this.compare.mycoreIDPostMap[id]))
        .map(id => [id, this.compare.mycoreIDPostMap[id]]);
    } else {
      this.notImported = this.compare.notImportedPosts;
      this.postMyCoReKeys = Object.keys(this.compare.mycoreIDPostMap)
        .sort()
        .reverse()
        .map(id => [id, this.compare.mycoreIDPostMap[id]]);

    }
  }
}

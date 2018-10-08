import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Md5Service} from "./md5.service";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private md5: Md5Service, private tokenService:TokenService) {

  }

  private static OBJECTS_PATH = "api/v1/objects";

  async importDocument(repository: string, document: Blob, authorization: string): Promise<string> {
    const formData = new FormData();

    formData.set("file", document);
    const response = await this.http.post(repository + ImportService.OBJECTS_PATH, formData, {
      headers : {
        "Authorization" : authorization,
        "Accept" : "text/xml"
      },
      observe : 'response', responseType : 'text'
    }).toPromise();
    const location = response.headers.get("Location");
    this.updateToken(response, repository);
    console.log("Location " + location);
    return location;
  }

  private updateToken(response, repository: string) {
    const newToken = response.headers.get("Authorization");
    if (newToken != null) {
      this.tokenService.setToken(repository, newToken);
    }
  }

  async importDerivate(repository: string, parentID: string, authorization: string): Promise<string> {
    const formData = new FormData();

    formData.set("label", "data object from " + parentID);

    const requestURL = repository + ImportService.OBJECTS_PATH + "/" + parentID + "/derivates";
    const response = await this.http.post(requestURL, formData, {
      headers: {
        "Authorization": authorization,
        "Accept": "text/xml"
      },
      observe: 'response', responseType: 'text'
    }).toPromise();

    this.updateToken(response, repository);

    return response.headers.get("Location");
  }

  async getDerivateID(repository: string, objectID:string, authorization: string){
    const requestURL = repository + ImportService.OBJECTS_PATH + "/" + objectID + "/derivates/";

    const derobjects:string = await this.http.get(requestURL, {     headers: {
        "Authorization": authorization,
        "Accept": "text/xml"
      },  responseType: 'text'}).toPromise();

    console.log(derobjects);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(derobjects, "text/xml");
    return xmlDoc.firstElementChild.firstElementChild.getAttribute("ID");
  }

  async importPDF(repository: string, objectID: string, derivateID: string,fileName:string, pdf: Blob, authorization: string) {
    const formData = new FormData();

    formData.set("file", pdf);
    formData.set("path", "/" + fileName);
    formData.set("maindoc", "true");
    formData.set("unzip", "false");
    formData.set("size", pdf.size.toString(10));

    const md5 = await this.md5.md5File(pdf);
    formData.set("md5", md5);


    const requestURL = repository + ImportService.OBJECTS_PATH + "/" + objectID + "/derivates/" + derivateID + "/contents/";
    const response = await this.http.post(requestURL, formData, {
      headers: {
        "Authorization": authorization,
        "Accept": "text/xml"
      },
      observe: 'response', responseType: 'text'
    }).toPromise();
    this.updateToken(response, repository);
    return response.headers.get("Location");
  }
}

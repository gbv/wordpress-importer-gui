import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient) {

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
    return response.headers.get("Location");
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from "./config.service";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  importPost(postId: number, configId: string) {
    this.http.post(environment.endpoint + "import/" + configId + "/" + postId + "?user=administrator&password=alleswirdgut", null).subscribe(str => {
      console.log(str);
    })
  }
}

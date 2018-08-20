import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  getServiceConfig(): Observable<ImporterConfiguration> {
    return this.http.get<ImporterConfiguration>(environment.endpoint + "config");
  }
}

export interface ImporterCompare {
  notImportedPosts: PostInfo[];
  mycoreIDPostMap:{ [mycoreID:string]:PostInfo};
}

export interface PostInfo {
  title: string;
  id: number;
  url: string;
  importedURL?: string;
}

export interface ImporterConfiguration {
  [Key: string]: ImporterConfigurationPart;
}

export interface ImporterConfigurationPart {
  blog: string;
  repository: string;
  parentObject: string;
}

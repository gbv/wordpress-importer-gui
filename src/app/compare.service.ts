import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor(private http: HttpClient) {
  }

  getServiceConfig(): Observable<ImporterConfiguration> {
    return this.http.get<ImporterConfiguration>(environment.endpoint + "config");
  }

  getServiceCompare(id: string): Observable<ImporterCompare> {
    return this.http.get<ImporterCompare>(environment.endpoint + "compare/" + id);
  }
}

export interface ImporterCompare {
  notImportedPosts: PostInfo[];
}

export interface PostInfo {
  title: string;
  id: number;
  url: string;
}

export interface ImporterConfiguration {
  [Key: string]: ImporterConfigurationPart;
}

export interface ImporterConfigurationPart {
  blog: string;
  repository: string;
  parentObject: string;
}

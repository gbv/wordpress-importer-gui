import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {environment} from '../environments/environment';
import {ImporterCompare} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor(private http: HttpClient) {
  }

  getServiceCompare(id: string): Observable<ImporterCompare> {
    return this.http.get<ImporterCompare>(environment.endpoint + "compare/" + id);
  }
}


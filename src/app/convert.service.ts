/*
 * This file is part of ***  M y C o R e  ***
 * See http://www.mycore.de/ for details.
 *
 * MyCoRe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MyCoRe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MyCoRe.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs/internal/Observable";

@Injectable({
  providedIn : 'root'
})
export class ConvertService {

  constructor(private http: HttpClient) {
  }

  public async convertPost(postId: number, configId: string): Promise<Blob> {
    const resp = await this.http.get(`${environment.endpoint}convert/mods/${configId}/${postId}`, {responseType : "blob"}).toPromise();
    return resp;
  }

  public async convertPDF(postId: number, configId: string): Promise<{ fileName: string, blob: Blob }> {
    const resp = await this.http.get(`${environment.endpoint}convert/pdf/${configId}/${postId}`, {observe: 'response', responseType: 'blob'}).toPromise();
    return {fileName: this.getFileNameFromResponseContentDisposition(resp), blob: resp.body};
  }

  getFileNameFromResponseContentDisposition(res: HttpResponse<Blob>) {
    const contentDisposition = res.headers.get('Content-Disposition') || '';
    const matches = /filename="([^;]+)"/ig.exec(contentDisposition);
    const fileName = ((matches||[null])[1] || 'untitled').trim();
    return fileName;
  };
}

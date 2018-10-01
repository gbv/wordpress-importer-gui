import {Injectable} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {Observable} from "rxjs/internal/Observable";
import {config} from "rxjs/internal-compatibility";
import {Subject} from "rxjs/internal/Subject";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private static KEY_TOKEN = "token";
  private static KEY_TOKEN_EXPIRE = "tokenExpire";
  private static TOKEN_VALIDITY_TIME = 1024 * 60 * 10;
  private subjectMap: {} = {};

  constructor() {
  }

  public setToken(configId: string, token: string) {
    if ("localStorage" in window) {

      window.localStorage.setItem(TokenService.KEY_TOKEN + "_" + configId, token);
      window.localStorage.setItem(TokenService.KEY_TOKEN_EXPIRE + "_" + configId, new Date().valueOf().toString(10));

      if (!(configId in this.subjectMap)) {
        this.subjectMap[configId] = new Subject();
      }
      const tokenSubject = this.subjectMap[configId];
      tokenSubject.next({token: token});
      window.setTimeout(() => tokenSubject.next({token: null}), TokenService.TOKEN_VALIDITY_TIME);

    }
  }

  public getToken(configId: string) {
    if (!(configId in this.subjectMap)) {
      this.subjectMap[configId] = new Subject();
    }

    const tokenSubject = this.subjectMap[configId];
    if ("localStorage" in window) {
      const storage = window.localStorage;

      const key = storage.getItem(TokenService.KEY_TOKEN + "_" + configId);
      const keyExpire = storage.getItem(TokenService.KEY_TOKEN_EXPIRE + "_" + configId);

      if (key != null && keyExpire != null) {
        let dateNumber: number;
        if (dateNumber = parseInt(keyExpire)) {
          const keyAge = (new Date()).valueOf() - dateNumber;
          if (keyAge < TokenService.TOKEN_VALIDITY_TIME) {
            const validityTime = TokenService.TOKEN_VALIDITY_TIME - keyAge;
            let token = {token: key};
            window.setTimeout(() => tokenSubject.next({token: null}), keyAge);
            window.setTimeout(()=>tokenSubject.next(token), 100);
          }
        }
      }
    }

    return tokenSubject.asObservable();
  }
}


export interface Token {
  token: string | null;
}

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

  private timeoutId = null;

  constructor() {
  }

  public setToken(repository: string, token: string) {
    if ("localStorage" in window) {

      window.localStorage.setItem(TokenService.KEY_TOKEN + "_" + repository, token);
      window.localStorage.setItem(TokenService.KEY_TOKEN_EXPIRE + "_" + repository, new Date().valueOf().toString(10));

      if (!(repository in this.subjectMap)) {
        this.subjectMap[repository] = new Subject();
      }
      const tokenSubject = this.subjectMap[repository];
      tokenSubject.next({token: token});
      this.clearExistingTimeout();
      this.timeoutId = window.setTimeout(() => tokenSubject.next({token: null}), TokenService.TOKEN_VALIDITY_TIME);

    }
  }

  private clearExistingTimeout() {
    if (this.timeoutId != null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public getToken(repository: string) {
    if (!(repository in this.subjectMap)) {
      this.subjectMap[repository] = new Subject();
    }

    const tokenSubject = this.subjectMap[repository];
    if ("localStorage" in window) {
      const storage = window.localStorage;

      const key = storage.getItem(TokenService.KEY_TOKEN + "_" + repository);
      const keyExpire = storage.getItem(TokenService.KEY_TOKEN_EXPIRE + "_" + repository);

      if (key != null && keyExpire != null) {
        let dateNumber: number;
        if (dateNumber = parseInt(keyExpire)) {
          const keyAge = (new Date()).valueOf() - dateNumber;
          if (keyAge < TokenService.TOKEN_VALIDITY_TIME) {
            const validityTime = TokenService.TOKEN_VALIDITY_TIME - keyAge;
            let token = {token: key};

            this.clearExistingTimeout();
            this.timeoutId = window.setTimeout(() => tokenSubject.next({token: null}), validityTime);
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

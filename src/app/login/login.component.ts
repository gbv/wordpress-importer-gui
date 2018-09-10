import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ConfigService, ImporterConfiguration} from "../config.service";
import {HttpClient} from "@angular/common/http";
import {Color, MessageService} from "../message.service";

@Component({
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor(private configService: ConfigService,
              private http: HttpClient,
              private messageService: MessageService) {

  }

  private static LOGIN_PATH = "api/v1/auth/login";
  private static TOKEN_VALIDITY_TIME = 1024 * 60 * 30;
  private static KEY_TOKEN = "token";
  private static KEY_TOKEN_EXPIRE = "tokenExpire";

  private login: FormGroup;
  private userName: FormControl;
  private password: FormControl;

  @Input('configId') private configId: string;
  @Input('auth') public auth: {token:string};

  ngOnInit() {
    this.userName = new FormControl();
    this.password = new FormControl();

    this.login = new FormGroup({
      user : this.userName,
      password : this.password
    });

    if ("localStorage" in window) {
      const storage = window.localStorage;

      const key = storage.getItem(LoginComponent.KEY_TOKEN + "_" + this.configId);
      const keyExpire = storage.getItem(LoginComponent.KEY_TOKEN_EXPIRE + "_" + this.configId);

      if (key != null && keyExpire != null) {
        let dateNumber: number;
        if (dateNumber = parseInt(keyExpire)) {
          const keyAge = (new Date()).valueOf() - dateNumber;
          if (keyAge < LoginComponent.TOKEN_VALIDITY_TIME) {
            this.setAuthToken(key, LoginComponent.TOKEN_VALIDITY_TIME - keyAge);
          }
        }
      }
    }

  }

  async getToken() {
    try {
      console.log(this.configId);
      const importerConfiguration: ImporterConfiguration = await this.configService.getServiceConfig().toPromise();
      const repository = importerConfiguration[ this.configId ].repository;
      const options = {headers : {"Authorization" : `Basic ${btoa(this.userName.value + ":" + this.password.value)}`}};
      const authResponse = await this.http.get<AuthResponse>(repository + LoginComponent.LOGIN_PATH, options).toPromise();
      if(authResponse.login_success){
        const token = authResponse.token_type + " " + authResponse.access_token;
        this.setAuthToken(token, LoginComponent.TOKEN_VALIDITY_TIME);
        if ("localStorage" in window) {
          window.localStorage.setItem(LoginComponent.KEY_TOKEN + "_" + this.configId, token);
          window.localStorage.setItem(LoginComponent.KEY_TOKEN_EXPIRE + "_" + this.configId, new Date().valueOf().toString(10));
        }
      } else {
        this.messageService.push({
          title: "Login Fehlgeschlagen!",
          message: "Login Fehlgeschlagen. Überprüfen Sie ihren Benutzernamen und Passwort!",
          color: Color.warning
        })
      }
    } catch (e) {
      if ("message" in e) {
        this.messageService.push({message: e.message, title: "Fehler!", color: Color.danger});
      } else {
        this.messageService.push({message: e.toString(), title: "Fehler!", color: Color.danger});
      }
      this.auth = null;
    }
  }

  private setAuthToken(token: string, expires: number) {
    this.auth.token = token;
    window.setTimeout(() => this.auth.token = null, expires)
  }
}

interface AuthResponse {
  login_success: boolean;
  access_token: string;
  token_type: string;
}

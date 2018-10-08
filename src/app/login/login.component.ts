import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ConfigService, ImporterConfiguration} from "../config.service";
import {HttpClient} from "@angular/common/http";
import {Color, MessageService} from "../message.service";
import {TokenService} from "../token.service";

@Component({
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor(private configService: ConfigService,
              private http: HttpClient,
              private messageService: MessageService,
              private tokenService: TokenService) {

  }

  private static LOGIN_PATH = "api/v1/auth/login";

  public login: FormGroup;
  private userName: FormControl;
  private password: FormControl;

  @Input('configId') private configId: string;

  ngOnInit() {
    this.userName = new FormControl();
    this.password = new FormControl();

    this.login = new FormGroup({
      user : this.userName,
      password : this.password
    });

  }

  async getToken() {
    try {
      const importerConfiguration: ImporterConfiguration = await this.configService.getServiceConfig().toPromise();
      const repository = importerConfiguration[ this.configId ].repository;
      const options = {headers : {"Authorization" : `Basic ${btoa(this.userName.value + ":" + this.password.value)}`}};
      const authResponse = await this.http.get<AuthResponse>(repository + LoginComponent.LOGIN_PATH, options).toPromise();
      if(authResponse.login_success){
        const token = authResponse.token_type + " " + authResponse.access_token;
        this.tokenService.setToken(repository, token);
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
    }
  }
}

interface AuthResponse {
  login_success: boolean;
  access_token: string;
  token_type: string;
}

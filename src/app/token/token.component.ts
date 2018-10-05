import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TokenService} from "../token.service";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private tokenService: TokenService, private configService:ConfigService) {
    this.route.params.subscribe(params => {
      const {id, token} = params;
      configService.getServiceConfig().toPromise().then((config)=>{
        tokenService.setToken( config[id].repository, token);
        this.router.navigate(['/compare/', id, 'import']);
      });
    });
  }

  ngOnInit() {

  }


}

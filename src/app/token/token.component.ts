import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TokenService} from "../token.service";

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private tokenService: TokenService) {
    this.route.params.subscribe(params => {
      const {id, token} = params;
      tokenService.setToken(id, token);
      this.router.navigate(['/compare/', id, 'import']);
    });
  }

  ngOnInit() {

  }


}

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompareService } from "../compare.service";
import {Subscription} from "rxjs/internal/Subscription";
import {ImporterCompare, PostInfo} from "../config.service";
import {ImportService} from "../import.service";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  constructor(private route: ActivatedRoute, private compareService:CompareService, private importService:ImportService) {
    this.route.params.subscribe(params => this.displayCompare(params["id"]));
  }


  ngOnInit() {
  }

  private compare: ImporterCompare = { notImportedPosts: (<PostInfo[]>[])};
  private currentSubscription: Subscription = null;
  private currentShowingID:string;

  displayCompare(id: string) {
    if(this.currentSubscription!=null){
      this.currentSubscription.unsubscribe();
    }
    this.currentShowingID = id;
    this.currentSubscription = this.compareService.getServiceCompare(id).subscribe((compare)=>{
      this.compare = compare;
    });
  }

  startImport(post:PostInfo) {
    this.importService.importPost(post.id, this.currentShowingID);

    console.log("Importing " + post.title);
  }
}

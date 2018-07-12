import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CompareService, ImporterCompare, PostInfo} from "../compare.service";
import {Subscription} from "rxjs/internal/Subscription";

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  constructor(private route: ActivatedRoute, private compareService:CompareService) {
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
    console.log("Importing " + post.title);
  }
}

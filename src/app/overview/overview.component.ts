import {Component, OnInit} from '@angular/core';
import {CompareService, ImporterConfigurationPart} from "../compare.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  private importerConfiguration: [{ id: string, part: ImporterConfigurationPart }];

  constructor(private compareService: CompareService) {
    this.compareService.getServiceConfig().subscribe(configuration => {
      console.log(configuration);
      this.importerConfiguration = <any>[];
      for (let id in configuration) {
        this.importerConfiguration.push({id: id, part: configuration[id]});
      }
    });
  }

  ngOnInit() {
  }

}

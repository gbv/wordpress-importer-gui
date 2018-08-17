import {Component, OnInit} from '@angular/core';
import {ConfigService, ImporterConfigurationPart} from "../config.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  public importerConfiguration: [{ id: string, part: ImporterConfigurationPart }];

  constructor(private configService: ConfigService) {
    this.configService.getServiceConfig().subscribe(configuration => {
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

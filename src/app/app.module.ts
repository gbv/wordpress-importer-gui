import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {OverviewComponent} from './overview/overview.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {CompareComponent} from './compare/compare.component';

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', component: OverviewComponent},
  {path: 'compare/:id', component: CompareComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    CompareComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes, {useHash: true})

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


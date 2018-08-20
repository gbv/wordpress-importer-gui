import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {OverviewComponent} from './overview/overview.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {CompareComponent} from './compare/compare.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

const routes: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full'},
  {path: 'overview', component: OverviewComponent},
  {path: 'compare/:id/:mode', component: CompareComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    CompareComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, RouterModule.forRoot(routes, {useHash: true}), FormsModule, ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


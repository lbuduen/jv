import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MainNavRoutingModule } from "./main-nav-routing.module";

import { MainNavComponent } from "./main-nav.component";
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialComponentsModule,
    MainNavRoutingModule
  ],
  declarations: [
    MainNavComponent,
    DashboardComponent
  ]
})
export class MainNavModule { }

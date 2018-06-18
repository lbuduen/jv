import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { MaterialComponentsModule } from '../material-components/material-components.module';
import { MainNavRoutingModule } from "./main-nav-routing.module";

import { MainNavComponent } from "./main-nav.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccomodationComponent } from './accomodation/accomodation.component';
import { AccomodationFormComponent } from './accomodation/accomodation-form/accomodation-form.component';
import { AccomodationListComponent } from './accomodation/accomodation-list/accomodation-list.component';
import { AccomodationDetailsComponent } from './accomodation/accomodation-details/accomodation-details.component';
import { AccomodationDeleteDialog } from './accomodation/accomodation-delete-dialog.component';

import { TransportationComponent } from './transportation/transportation.component';
import { ActivitiesComponent } from './activities/activities.component';
import { PackagesComponent } from './packages/packages.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialComponentsModule,
    MainNavRoutingModule
  ],
  declarations: [
    MainNavComponent,
    DashboardComponent,
    AccomodationComponent,
    AccomodationFormComponent,
    AccomodationListComponent,
    AccomodationDetailsComponent,
    AccomodationDeleteDialog,
    TransportationComponent,
    ActivitiesComponent,
    PackagesComponent
  ],
  entryComponents: [
    AccomodationDeleteDialog
  ]
})
export class MainNavModule { }

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

import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDeleteDialog } from "./user/user-delete-dialog.component";
import { UserDetailsComponent } from './user/user-details/user-details.component';

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
    PackagesComponent,
    UserComponent,
    UserFormComponent,
    UserListComponent,
    UserDeleteDialog,
    UserDetailsComponent
  ],
  entryComponents: [
    AccomodationDeleteDialog,
    UserDeleteDialog
  ]
})
export class MainNavModule { }

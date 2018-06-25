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

import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDeleteDialog } from "./user/user-delete-dialog.component";
import { UserDetailsComponent } from './user/user-details/user-details.component';

import { ActivitiesComponent } from './activities/activities.component';
import { ActivityFormComponent } from './activities/activity-form/activity-form.component';
import { ActivityListComponent } from './activities/activity-list/activity-list.component';
import { ActivityDeleteDialog } from "./activities/activity-delete-dialog.component";
import { ActivityDetailsComponent } from './activities/activity-details/activity-details.component';

import { TransportationComponent } from './transportation/transportation.component';
import { TransportationFormComponent } from './transportation/transportation-form/transportation-form.component';
import { TransportationListComponent } from './transportation/transportation-list/transportation-list.component';
import { TransportationDeleteDialog } from "./transportation/transportation-delete-dialog.component";
import { TransportationDetailsComponent } from './transportation/transportation-details/transportation-details.component';

import { MediaComponent } from './media/media.component';

import { PackagesComponent } from './packages/packages.component';
import { PackageFormComponent } from './packages/package-form/package-form.component';

import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerDeleteDialog } from "./customer/customer-delete-dialog.component";

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
    PackagesComponent,
    UserComponent,
    UserFormComponent,
    UserListComponent,
    UserDeleteDialog,
    UserDetailsComponent,
    ActivitiesComponent,
    ActivityFormComponent,
    ActivityListComponent,
    ActivityDeleteDialog,
    ActivityDetailsComponent,
    TransportationComponent,
    TransportationFormComponent,
    TransportationListComponent,
    TransportationDeleteDialog,
    TransportationDetailsComponent,
    MediaComponent,
    PackageFormComponent,
    CustomerComponent,
    CustomerFormComponent,
    CustomerListComponent,
    CustomerDeleteDialog
  ],
  entryComponents: [
    AccomodationDeleteDialog,
    UserDeleteDialog,
    ActivityDeleteDialog,
    TransportationDeleteDialog,
    CustomerDeleteDialog
  ]
})
export class MainNavModule { }

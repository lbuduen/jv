import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "../auth-guard.service";

import { MainNavComponent } from "./main-nav.component";
import { DashboardComponent } from './dashboard/dashboard.component';

import { AccomodationComponent } from "./accomodation/accomodation.component";
import { AccomodationFormComponent } from "./accomodation/accomodation-form/accomodation-form.component";
import { AccomodationListComponent } from "./accomodation/accomodation-list/accomodation-list.component";
import { AccomodationDetailsComponent } from "./accomodation/accomodation-details/accomodation-details.component";

import { TransportationComponent } from './transportation/transportation.component';

import { ActivitiesComponent } from './activities/activities.component';

import { PackagesComponent } from './packages/packages.component';

const mainNavRoutes: Routes = [
  {
    path: 'admin',
    component: MainNavComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'accomodation',
        component: AccomodationComponent,
        children: [
          {
            path: 'add',
            component: AccomodationFormComponent
          },
          {
            path: 'edit/:id',
            component: AccomodationFormComponent
          },
          {
            path: 'details/:id',
            component: AccomodationDetailsComponent
          },
          {
            path: '',
            component: AccomodationListComponent
          }
        ]
      },
      {
        path: 'transportation',
        component: TransportationComponent
      },
      {
        path: 'activities',
        component: ActivitiesComponent
      },
      {
        path: 'packages',
        component: PackagesComponent
      },
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(mainNavRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MainNavRoutingModule { }

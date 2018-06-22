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

import { PackagesComponent } from './packages/packages.component';

import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailsComponent } from './user/user-details/user-details.component';

import { ActivitiesComponent } from './activities/activities.component';
import { ActivityFormComponent } from './activities/activity-form/activity-form.component';
import { ActivityListComponent } from './activities/activity-list/activity-list.component';
import { ActivityDetailsComponent } from './activities/activity-details/activity-details.component';

import { TransportationComponent } from './transportation/transportation.component';
import { TransportationFormComponent } from './transportation/transportation-form/transportation-form.component';
import { TransportationListComponent } from './transportation/transportation-list/transportation-list.component';
import { TransportationDetailsComponent } from './transportation/transportation-details/transportation-details.component';

import { MediaComponent } from './media/media.component';

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
        component: TransportationComponent,
        children: [
          {
            path: 'add',
            component: TransportationFormComponent
          },
          {
            path: 'edit/:id',
            component: TransportationFormComponent
          },
          {
            path: 'details/:id',
            component: TransportationDetailsComponent
          },
          {
            path: '',
            component: TransportationListComponent
          }
        ]
      },
      {
        path: 'activities',
        component: ActivitiesComponent,
        children: [
          {
            path: 'add',
            component: ActivityFormComponent
          },
          {
            path: 'edit/:id',
            component: ActivityFormComponent
          },
          {
            path: 'details/:id',
            component: ActivityDetailsComponent
          },
          {
            path: '',
            component: ActivityListComponent
          }
        ]
      },
      {
        path: 'packages',
        component: PackagesComponent
      },
      {
        path: 'users',
        component: UserComponent,
        children: [
          {
            path: 'add',
            component: UserFormComponent
          },
          {
            path: 'edit/:id',
            component: UserFormComponent
          },
          {
            path: 'details/:id',
            component: UserDetailsComponent
          },
          {
            path: '',
            component: UserListComponent
          }
        ]
      },
      {
        path: 'media',
        component: MediaComponent
      }
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

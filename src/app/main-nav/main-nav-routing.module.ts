import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from "@angular/router";

import { AuthGuardService } from "../auth-guard.service";

import { MainNavComponent } from "./main-nav.component";
import { DashboardComponent } from './dashboard/dashboard.component';

const mainNavRoutes: Routes = [
  {
    path: 'admin',
    component: MainNavComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
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

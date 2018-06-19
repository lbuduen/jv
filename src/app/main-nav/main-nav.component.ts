import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppService } from "../app.service";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  user = {};
  totals = {
    accomodation: 0,
    users: 0
  };

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private appsrv: AppService,
    private authsrv: AuthService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(this.appsrv.getSession('user'));
    this.appsrv.getTotals().subscribe(res => {
      this.totals = res;
    })
  }

  logout() {
    this.authsrv.logout();
    this.router.navigate(['/login']);
  }
}

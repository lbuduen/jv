import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from "@angular/router";

import { MatSnackBar } from '@angular/material';

import { AuthService } from "../auth.service";
import { UserService } from "../main-nav/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  credentials: any = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    public snackBar: MatSnackBar,
    private usrv: UserService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.credentials).subscribe(() => {
      if (this.authService.isLoggedIn()) {
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/admin/dashboard';

        this.router.navigate([redirect]);
      }
    });
  }

  createAdmin() {
    this.usrv.create({
      firstName: 'Leodan',
      lastName: 'A Buduen',
      email: 'lbuduen@gmail.com',
      password: 'hope2018',
      role: ['admin']
    }).subscribe(
      res => {
        this.elementRef.nativeElement.querySelector('#admin_btn').remove();
      },
      error => { }
    );
  }
}

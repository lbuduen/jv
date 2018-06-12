import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { MatSnackBar } from '@angular/material';

import { AuthService } from "../auth.service";

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
    public snackBar: MatSnackBar
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

  /*   create() {
      this.usrv.create({
        firstName: 'Leodan',
        lastName: 'A Buduen',
        email: 'lbuduen@gmail.com',
        password: 'hope2018'
      }).subscribe(
        res => { },
        error => { }
      );
    } */
}

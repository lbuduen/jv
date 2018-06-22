import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from '@angular/material';

import { UserService } from "../user.service";
import { EventService } from "../../../event.service";

import { ROLES } from "../data.model";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  roles = ROLES;

  id: String = ''; //user id

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usrv: UserService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.createUserForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.usrv.read(this.id).subscribe(user => {
        this.userForm.patchValue(user);
      }, error => {
        this.snackBar.open(`Error retrieving user ${this.id}`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/users']);
      });
    }
  }

  createUserForm() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: '',
      email: ['', [Validators.required, Validators.email]],
      phone: '',
      role: '',
      password: ['', Validators.minLength(8)],
      photo: ''
    });
  }

  save() {
    if (this.id) {
      this.usrv.update(this.id, this.userForm.value).subscribe(res => {
        this.snackBar.open(`User ${this.userForm.get('firstName').value} has been updated`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/users']);
      });
    }
    else {
      this.usrv.create(this.userForm.value).subscribe(res => {
        this.eventServ.broadcast('recount');

        this.snackBar.open(`User ${this.userForm.get('firstName').value} has been created`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/users']);
      });
    }
  }

}

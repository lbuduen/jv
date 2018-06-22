import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from '@angular/material';

import { TransportationService } from "../transportation.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-transportation-form',
  templateUrl: './transportation-form.component.html',
  styleUrls: ['./transportation-form.component.css']
})
export class TransportationFormComponent implements OnInit {

  means = new FormControl('land');
  drivers = [];
  id: String = ''; //transport id

  byLandForm: FormGroup;
  byAirForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tranServ: TransportationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.tranServ.getDrivers().subscribe(users => {
      this.drivers = users;
    });

    this.createByLandForm();
    this.createByAirForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.tranServ.read(this.means.value, this.id).subscribe(transport => {
        if (this.means.value == 'land') {
          this.byLandForm.patchValue(transport);
          this.byLandForm.patchValue({
            driver: transport.driver._id
          });
        }
        else {
          this.byAirForm.patchValue(transport);
        }
      }, error => {
        this.snackBar.open(`Error retrieving transport ${this.id}`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/transportation']);
      });
    }
  }

  createByLandForm() {
    this.byLandForm = this.fb.group({
      brand: '',
      model: '',
      plate: '',
      capacity: '',
      color: '',
      driver: '',
      photo: '',
      observations: ''
    });
  }

  createByAirForm() {
    this.byAirForm = this.fb.group({
      company: '',
      flight: '',
      origin: '',
      destination: '',
      departure: '',
      arrival: ''
    });
  }

  save() {
    let form = (this.means.value == 'land') ? this.byLandForm : this.byAirForm;
    if (this.id) {

      this.tranServ.update(this.means.value, this.id, form.value).subscribe(res => {
        this.snackBar.open(`Transportation updated`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/transportation']);
      });
    }
    else {
      this.tranServ.create(this.means.value, form.value).subscribe(res => {
        this.eventServ.broadcast('recount');

        this.snackBar.open(`Transportation created`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/transportation']);
      });
    }
  }
}

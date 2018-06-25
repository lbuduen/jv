import { Component, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from '@angular/material';

import { PackageService } from "../package.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-package-setup',
  templateUrl: './package-setup.component.html',
  styleUrls: ['./package-setup.component.css']
})
export class PackageSetupComponent implements OnInit {

  id: String = ''; //package id

  detailsForm: FormGroup;
  transportationForm: FormGroup;
  accomodationForm: FormGroup;
  activitiesForm: FormGroup;

  data = new FormData();

  customers = [];
  riders = [];  // customers in a vehicle

  activities = '';
  activists = []; // customers in an activity
  guides = [];

  transportation = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pkgServ: PackageService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private elemRef: ElementRef,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.createDetailsForm();
    this.createTransportationForm();
    this.createActivitiesForm();
  }

  createDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      quota: '',
      startDate: '',
      endDate: '',
      privateRate: '',
      joinerRate: '',
      description: ''
    });
  }

  createTransportationForm() {
    this.transportationForm = this.fb.group({
      id: '',
      customers: '',
      date: ''
    });
  }

  createActivitiesForm() {
    this.activitiesForm = this.fb.group({
      id: '',
      guide: '',
      customers: '',
      date: ''
    });
  }

}

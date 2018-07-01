import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { PackageService } from "../package.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-package-setup',
  templateUrl: './package-setup.component.html',
  styleUrls: ['./package-setup.component.css']
})
export class PackageSetupComponent implements OnInit {

  id: String = ''; //package id
  pkg = {};

  // forms
  detailsForm: FormGroup;
  transportationForm: FormGroup;
  accomodationForm: FormGroup;
  activitiesForm: FormGroup;

  data = new FormData();

  customers = [];
  transportation = [];
  accomodation = [];
  activities = [];
  guides = [];

  riders = [];  // customers in a vehicle
  activists = []; // customers in an activity
  guests = []; // customers in accomodation

  displayedColumns = ['name', 'email', 'phone', 'rate', 'status', 'requested', 'menu'];
  customerDataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    this.pkgServ.get('accomodation').subscribe(acc => {
      this.accomodation = acc;
    });

    this.pkgServ.get('transportation').subscribe(trans => {
      this.transportation = trans;
    });

    this.pkgServ.get('activities').subscribe(act => {
      this.activities = act;
    });

    this.createDetailsForm();
    this.createTransportationForm();
    this.createActivitiesForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.pkgServ.read(this.id).subscribe(pkg => {
        this.pkg = pkg;

        this.detailsForm.patchValue(pkg);

        let accomodations = [];
        pkg.accomodation.forEach(acc => {
          accomodations.push(acc._id)
        });
        this.detailsForm.patchValue({
          accomodation: accomodations
        });

        let transportations = [];
        pkg.transportation.forEach(tr => {
          transportations.push(tr._id)
        });
        this.detailsForm.patchValue({
          transportation: transportations
        });

        let activities = [];
        pkg.activities.forEach(act => {
          activities.push(act._id)
        });
        this.detailsForm.patchValue({
          activities: activities
        });

        pkg.customers.forEach(c => {
          let customer = c.id;
          customer.rate = c.rate;
          customer.status = c.status;
          customer._id = c._id;
          customer.requested = c.requested;
          this.customers.push(customer);
        });

        this.customerDataSource = new MatTableDataSource(this.customers);
        this.customerDataSource.paginator = this.paginator;
        this.customerDataSource.sort = this.sort;
      }, error => {
        this.snackBar.open(`Error retrieving package ${this.id}`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/packages']);
      });
    }
  }

  createDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      quota: '',
      startDate: '',
      endDate: '',
      privateRate: '',
      joinerRate: '',
      transportation: '',
      accomodation: '',
      activities: '',
      description: ''
    });
  }

  createTransportationForm() {
    this.transportationForm = this.fb.group({
      vehicle: ['', Validators.required],
      customers: ['', Validators.required],
      date: ['', Validators.required]
    });
  }
  clearTransportationForm() {
    this.transportationForm.reset();
  }

  createActivitiesForm() {
    this.activitiesForm = this.fb.group({
      id: '',
      guide: '',
      customers: '',
      date: ''
    });
  }

  applyCustomersFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.customerDataSource.filter = filterValue;
    if (this.customerDataSource.paginator) {
      this.customerDataSource.paginator.firstPage();
    }
  }

  setRiders() {
    let ride = {
      vehicle: {},
      riders: [],
      date: ''
    };
    ride.vehicle = this.transportationForm.get('vehicle').value;
    ride.riders = this.transportationForm.get('customers').value;
    ride.date = this.transportationForm.get('date').value;

    this.riders.push(ride);
    console.log(this.riders);
  }

}

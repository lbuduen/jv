import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import {
  MatSnackBar,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";

import { PackageService } from "../package.service";
import { EventService } from "../../../event.service";
import { AddCustomerToRideDialog } from "./add-customer-ride-dialog.component";
import { refCount } from "rxjs/operators";

@Component({
  selector: "app-package-setup",
  templateUrl: "./package-setup.component.html",
  styleUrls: ["./package-setup.component.css"]
})
export class PackageSetupComponent implements OnInit {
  id: String = ""; // package id
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

  riders = []; // customers in a vehicle
  activists = []; // customers in an activity
  guests = []; // customers in accomodation

  displayedColumns = [
    "name",
    "email",
    "phone",
    "rate",
    "status",
    "requested",
    "menu"
  ];
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
    private eventServ: EventService,
    private addCustomerDlg: MatDialog
  ) {}

  ngOnInit() {
    this.pkgServ.get("accomodation").subscribe(acc => {
      this.accomodation = acc;
    });

    this.pkgServ.get("transportation").subscribe(trans => {
      this.transportation = trans;
    });

    this.pkgServ.get("activities").subscribe(act => {
      this.activities = act;
    });

    this.pkgServ.get("guides").subscribe(guides => {
      this.guides = guides;
    });

    this.createDetailsForm();
    this.createTransportationForm();
    this.createActivitiesForm();
    this.createAccomodationForm();

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.pkgServ.read(this.id).subscribe(
        pkg => {
          this.pkg = pkg;

          this.detailsForm.patchValue(pkg);

          const accomodations = [];
          pkg.accomodation.forEach(acc => {
            accomodations.push(acc._id);
          });
          this.detailsForm.patchValue({
            accomodation: accomodations
          });

          const transportations = [];
          pkg.transportation.forEach(tr => {
            transportations.push(tr._id);
          });
          this.detailsForm.patchValue({
            transportation: transportations
          });

          const activities = [];
          pkg.activities.forEach(act => {
            activities.push(act._id);
          });
          this.detailsForm.patchValue({
            activities: activities
          });

          pkg.customers.forEach(c => {
            const customer = c.id;
            customer.rate = c.rate;
            customer.status = c.status;
            customer._id = c._id;
            customer.requested = c.requested;
            this.customers.push(customer);
          });

          this.customerDataSource = new MatTableDataSource(this.customers);
          this.customerDataSource.paginator = this.paginator;
          this.customerDataSource.sort = this.sort;
        },
        error => {
          this.snackBar.open(`Error retrieving package ${this.id}`, "", {
            duration: 3000
          });
          this.router.navigate(["/admin/packages"]);
        }
      );
    }
  }

  createDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ["", Validators.required],
      quota: "",
      startDate: "",
      endDate: "",
      privateRate: "",
      joinerRate: "",
      transportation: "",
      accomodation: "",
      activities: "",
      description: ""
    });
  }

  createTransportationForm() {
    this.transportationForm = this.fb.group({
      vehicle: ["", Validators.required],
      customers: ["", Validators.required],
      pickup: ["", Validators.required],
      dropoff: ["", Validators.required],
      date: ["", Validators.required]
    });
  }
  clearTransportationForm() {
    this.transportationForm.reset();
  }

  createActivitiesForm() {
    this.activitiesForm = this.fb.group({
      activity: ["", Validators.required],
      guide: "",
      customers: ["", Validators.required],
      date: ""
    });
  }

  createAccomodationForm() {
    this.accomodationForm = this.fb.group({
      accomodation: ["", Validators.required],
      room: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      customers: ["", Validators.required]
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

  /* ------------------------------------------Transportation set up----------------------------------------------------*/

  setRiders() {
    const ride = {
      vehicle: {},
      riders: [],
      pickup: "",
      dropoff: "",
      date: Date
    };

    const veh = this.transportationForm.get("vehicle").value;
    const date = this.transportationForm.get("date").value;

    const in_array = this.riders.some(r => {
      return r.vehicle === veh && r.date === date;
    });

    if (!in_array) {
      const ridersTmp = this.transportationForm.get("customers").value;
      const ridersCpy = [];
      ridersTmp.forEach(rider => {
        ridersCpy.push(Object.assign({}, rider));
      });

      ride.vehicle = veh;
      ride.date = date;
      ride.riders = ridersCpy;
      ride.pickup = this.transportationForm.get("pickup").value;
      ride.dropoff = this.transportationForm.get("dropoff").value;
      this.riders.push(ride);
      this.transportationForm.reset();
    } else {
      this.snackBar.open(
        `There is already a ride set up for this vehicle at this date`,
        "",
        {
          duration: 3000
        }
      );
    }
  }

  addCustomer2Ride(ridePos) {
    let newCustomers = [];
    this.customers.forEach(c => {
      let in_ride = this.riders[ridePos].riders.some(rc => {
        return c._id === rc._id;
      });
      if (!in_ride) {
        newCustomers.push(c);
      }
    });
    const dialogRef = this.addCustomerDlg.open(AddCustomerToRideDialog, {
      height: "315px",
      width: "500px",
      data: {
        customers: newCustomers,
        ride: this.riders[ridePos],
        for: "ride"
      }
    });
    dialogRef.afterClosed().subscribe(customers => {
      if (customers) {
        customers.forEach(c => {
          this.riders[ridePos].riders.push(c);
        });
      }
    });
  }

  deleteRide(pos) {
    this.riders.splice(pos, 1);
  }

  deleteRider(ride, rider) {
    this.riders[ride].riders.splice(rider, 1);
    if (!this.riders[ride].riders.length) {
      this.riders.splice(ride, 1);
    }
  }
  /* ----------------------------------------end of Transportation set up----------------------------------------------*/

  setStatus(customer, toStatus) {
    this.pkgServ.setStatus(this.id, customer._id, toStatus).subscribe(res => {
      customer.status = toStatus;
    });
  }

  removeFromPackage(customer) {
    this.pkgServ.removeCustomer(this.id, customer._id).subscribe(res => {
      this.customers.forEach((c, i) => {
        if (c._id === customer._id) {
          this.customers.splice(i, 1);
          this.customerDataSource = new MatTableDataSource(this.customers);
          this.customerDataSource.paginator = this.paginator;
          this.customerDataSource.sort = this.sort;
        }
      });
    });
  }

  /* ----------------------------------------Activity set up----------------------------------------------*/

  setActivist() {
    const activist = {
      activity: "",
      guide: "",
      customers: [],
      date: Date
    };

    activist.activity = this.activitiesForm.get("activity").value;
    activist.guide = this.activitiesForm.get("guide").value;
    activist.date = this.activitiesForm.get("date").value;

    const activistsTmp = this.activitiesForm.get("customers").value;
    const activistsCpy = [];
    activistsTmp.forEach(actv => {
      activistsCpy.push(Object.assign({}, actv));
    });
    activist.customers = activistsCpy;
    this.activists.push(activist);
  }

  deleteActivist(pos, activist) {
    this.activists[pos].customers.splice(activist, 1);
    if (!this.activists[pos].customers.length) {
      this.activists.splice(pos, 1);
    }
  }

  addCustomer2Activity(actPos) {
    const newCustomers = [];
    this.customers.forEach(c => {
      const in_act = this.activists[actPos].customers.some(ac => {
        return c._id === ac._id;
      });
      if (!in_act) {
        newCustomers.push(c);
      }
    });
    const dialogRef = this.addCustomerDlg.open(AddCustomerToRideDialog, {
      height: "315px",
      width: "500px",
      data: {
        customers: newCustomers,
        activist: this.activists[actPos],
        for: "activity"
      }
    });
    dialogRef.afterClosed().subscribe(customers => {
      if (customers) {
        customers.forEach(c => {
          this.activists[actPos].customers.push(c);
        });
      }
    });
  }

  deleteActivity(actPos) {
    this.activists.splice(actPos, 1);
  }
  /* ----------------------------------------end of Activity set up----------------------------------------------*/

  /* ----------------------------------------Accomodation set up----------------------------------------------*/

  setAccomodation() {
    const row = {
      accomodation: {},
      room: {},
      customers: [],
      startDate: Date,
      endDate: Date
    };

    row.accomodation = this.accomodationForm.get("accomodation").value;
    row.room = this.accomodationForm.get("room").value;
    row.startDate = this.accomodationForm.get("startDate").value;
    row.endDate = this.accomodationForm.get("endDate").value;

    const guestsTmp = this.accomodationForm.get("customers").value;
    const guestsCpy = [];
    guestsTmp.forEach(g => {
      guestsCpy.push(Object.assign({}, g));
    });
    row.customers = guestsCpy;

    this.guests.push(row);
  }

  /* ----------------------------------------Accomodation set up----------------------------------------------*/
}

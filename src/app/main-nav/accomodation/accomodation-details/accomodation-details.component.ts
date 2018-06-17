import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar } from '@angular/material';

import { AccomodationService } from "../accomodation.service";

@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.component.html',
  styleUrls: ['./accomodation-details.component.css']
})
export class AccomodationDetailsComponent implements OnInit {

  accomodation = {};
  rooms = [];

  constructor(
    private accomServ: AccomodationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.accomServ.read(this.route.snapshot.paramMap.get('id')).subscribe(accom => {
      this.accomodation = accom;
      this.rooms = accom.rooms;
    });
  }

  delete(id: String) {
    this.accomServ.delete(id).subscribe(res => {
      this.snackBar.open(`${res.name} ${res.type} has been deleted`, '', {
        duration: 3000,
      });
      this.router.navigate(['/admin/accomodation']);
    });
  }
}

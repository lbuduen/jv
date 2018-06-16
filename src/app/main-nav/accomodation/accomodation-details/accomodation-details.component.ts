import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { AccomodationService } from "../accomodation.service";

@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.component.html',
  styleUrls: ['./accomodation-details.component.css']
})
export class AccomodationDetailsComponent implements OnInit {

  accomodation = {};

  constructor(
    private accomServ: AccomodationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.accomServ.read(this.route.snapshot.paramMap.get('id')).subscribe(accom => {
      this.accomodation = accom;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  startDate = new FormControl(new Date(), [Validators.required]);
  endDate = new FormControl();
  summary;

  constructor(
    private ds: DashboardService
  ) {}

  ngOnInit() {
    this.getSummary(this.startDate.value);
  }

  getSummary(sd, ed?) {
    this.ds.getSummary(sd, ed).subscribe(res => {
      this.summary = res;
    }, err => {
      console.log(err);
    });
  }

}

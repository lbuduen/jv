import { Component, OnInit } from '@angular/core';

import { MatSnackBar, MatTableDataSource } from '@angular/material';

import { AccomodationService } from "../accomodation.service";

@Component({
  selector: 'app-accomodation-list',
  templateUrl: './accomodation-list.component.html',
  styleUrls: ['./accomodation-list.component.css']
})
export class AccomodationListComponent implements OnInit {

  displayedColumns = ['name', 'type', 'address', 'phone', 'rooms', 'menu'];
  dataSource = {};

  constructor(
    private accomServ: AccomodationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.accomServ.list().subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
    });
  }

  delete(id: String) {
    this.accomServ.delete(id).subscribe(res => {

      /*  this.dataSource.forEach((accom, i) => {
         if (accom._id === id) {
           this.dataSource.splice(i, 1);
           console.log(`deleted ${i}`);
         }
       }); */

      this.snackBar.open(`${res.name} ${res.type} has been deleted`, '', {
        duration: 3000,
      });
    });
  }
}
import { Component, OnInit } from '@angular/core';

import { MatSnackBar, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccomodationDeleteDialog } from "../accomodation-delete-dialog.component";

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
    private snackBar: MatSnackBar,
    private delDialog: MatDialog
  ) { }

  ngOnInit() {
    this.accomServ.list().subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(AccomodationDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    });
  }
}
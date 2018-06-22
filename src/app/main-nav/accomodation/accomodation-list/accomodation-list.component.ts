import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccomodationDeleteDialog } from "../accomodation-delete-dialog.component";

import { AccomodationService } from "../accomodation.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-accomodation-list',
  templateUrl: './accomodation-list.component.html',
  styleUrls: ['./accomodation-list.component.css']
})
export class AccomodationListComponent implements OnInit {

  displayedColumns = ['name', 'type', 'address', 'phone', 'rooms', 'menu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private accomServ: AccomodationService,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.accomServ.list().subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

          this.dataSource.data.forEach((accom, i) => {
            if (accom._id === id) {
              this.dataSource.data.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });

          this.eventServ.broadcast('recount');

          this.snackBar.open(`${res.name} ${res.type} has been deleted`, '', {
            duration: 3000,
          });
        }, error => {
          this.snackBar.open('Error: ' + error.statusText, '', {
            duration: 3000,
          });
        });
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
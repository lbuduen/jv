import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerDeleteDialog } from "../customer-delete-dialog.component";

import { CustomerService } from "../customer.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  displayedColumns = ['name', 'email', 'phone', 'packages', 'menu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private customerServ: CustomerService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.customerServ.list().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(CustomerDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerServ.delete(id).subscribe(res => {

          this.dataSource.data.forEach((user, i) => {
            if (user._id === id) {
              this.dataSource.data.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Customer ${res.firstName} has been deleted`, '', {
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

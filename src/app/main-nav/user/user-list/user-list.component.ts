import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserDeleteDialog } from "../user-delete-dialog.component";

import { UserService } from "../user.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  displayedColumns = ['name', 'email', 'phone', 'role', 'menu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private usrv: UserService
  ) { }

  ngOnInit() {
    this.usrv.list().subscribe(users => {
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(UserDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usrv.delete(id).subscribe(res => {

          this.dataSource.data.forEach((user, i) => {
            if (user._id === id) {
              this.dataSource.data.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });

          this.snackBar.open(`User ${res.firstName} has been deleted`, '', {
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

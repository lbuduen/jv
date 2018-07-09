import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PackageDeleteDialog } from "../package-delete-dialog.component";

import { PackageService } from "../package.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  displayedColumns = ['name', 'startDate', 'endDate', 'quota', 'requests', 'menu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private pkgServ: PackageService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.pkgServ.list().subscribe(pkgs => {
      this.dataSource = new MatTableDataSource(pkgs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(PackageDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pkgServ.delete(id).subscribe(res => {

          this.dataSource.data.forEach((user, i) => {
            if (user._id === id) {
              this.dataSource.data.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Package ${res.name} has been deleted`, '', {
            duration: 3000,
          });
        }, err => {
          this.snackBar.open(`Package can not be deleted because it's currently active`, '', {
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

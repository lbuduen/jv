import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TransportationDeleteDialog } from "../transportation-delete-dialog.component";

import { TransportationService } from "../transportation.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-transportation-list',
  templateUrl: './transportation-list.component.html',
  styleUrls: ['./transportation-list.component.css']
})
export class TransportationListComponent implements OnInit {

  displayedColumns = ['brand', 'model', 'plate', 'capacity', 'driver', 'menu'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private tranServ: TransportationService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.tranServ.list('land').subscribe(transportation => {
      this.dataSource = new MatTableDataSource(transportation);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(TransportationDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tranServ.delete('land', id).subscribe(res => {

          this.dataSource.data.forEach((act, i) => {
            if (act._id === id) {
              this.dataSource.data.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.dataSource.data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          });
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Transportation deleted`, '', {
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

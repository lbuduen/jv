import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { PackageService } from "../package.service";

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  customers;
  displayedColumns = ['select', 'name', 'email', 'phone', 'rate'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<any>(true, []);

  constructor(
    private pkgServ: PackageService,
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit() {
    this.pkgServ.getNewCustomers(this.data.pkg._id).subscribe(customers => {
      this.dataSource = new MatTableDataSource(customers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, err => { });
  }

  setRate(event, customer) {
    customer.rate = event.value;
    customer.status = 'requested';
    customer.requested = new Date();
  }

}

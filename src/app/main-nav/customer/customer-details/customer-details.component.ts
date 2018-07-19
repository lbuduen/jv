import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerDeleteDialog } from "../customer-delete-dialog.component";

import { CustomerService } from "../customer.service";
import { EventService } from "../../../event.service";
import { Globals } from "../../../globals";

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {

  private MEDIA_URL = Globals.MEDIA_URL;

  customer;
  pkg;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private customServ: CustomerService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.customServ.read(this.route.snapshot.paramMap.get('id')).subscribe(customer => {
      this.customer = customer.customer;
      this.pkg = customer.packages;
    }, error => {
      this.snackBar.open('Error retrieving the details of this customer', '', {
        duration: 3000,
      });
      this.router.navigate(['/admin/customers']);
    });
  }

  delete(id: String) {
    const dialogRef = this.delDialog.open(CustomerDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customServ.delete(id).subscribe(res => {
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Customer ${res.firstName} has been deleted`, '', {
            duration: 3000,
          });
          this.router.navigate(['/admin/customers']);
        });
      }
    });
  }

}

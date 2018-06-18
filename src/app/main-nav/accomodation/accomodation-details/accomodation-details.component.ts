import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccomodationDeleteDialog } from "../accomodation-delete-dialog.component";

import { AccomodationService } from "../accomodation.service";

@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.component.html',
  styleUrls: ['./accomodation-details.component.css']
})
export class AccomodationDetailsComponent implements OnInit {

  accomodation = {};
  rooms = [];

  constructor(
    private accomServ: AccomodationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog
  ) { }

  ngOnInit() {
    this.accomServ.read(this.route.snapshot.paramMap.get('id')).subscribe(accom => {
      this.accomodation = accom;
      this.rooms = accom.rooms;
    }, error => {
      this.snackBar.open('Error retrieving the details of this accomodation', '', {
        duration: 3000,
      });
      this.router.navigate(['/admin/accomodation']);
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
          this.snackBar.open(`${res.name} ${res.type} has been deleted`, '', {
            duration: 3000,
          });
          this.router.navigate(['/admin/accomodation']);
        });
      }
    });
  }
}
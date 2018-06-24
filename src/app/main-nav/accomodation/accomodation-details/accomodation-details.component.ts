import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccomodationDeleteDialog } from "../accomodation-delete-dialog.component";

import { AccomodationService } from "../accomodation.service";
import { EventService } from "../../../event.service";
import { Globals } from "../../../globals";

@Component({
  selector: 'app-accomodation-details',
  templateUrl: './accomodation-details.component.html',
  styleUrls: ['./accomodation-details.component.css']
})
export class AccomodationDetailsComponent implements OnInit {

  private MEDIA_URL = Globals.MEDIA_URL;

  accomodation = {};
  rooms = [];

  constructor(
    private accomServ: AccomodationService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private eventServ: EventService
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
          this.eventServ.broadcast('recount');

          this.snackBar.open(`${res.name} ${res.type} has been deleted`, '', {
            duration: 3000,
          });
          this.router.navigate(['/admin/accomodation']);
        });
      }
    });
  }
}
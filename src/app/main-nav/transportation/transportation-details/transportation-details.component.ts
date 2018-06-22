import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TransportationDeleteDialog } from "../transportation-delete-dialog.component";

import { TransportationService } from "../transportation.service";
import { EventService } from "../../../event.service";

@Component({
  selector: 'app-transportation-details',
  templateUrl: './transportation-details.component.html',
  styleUrls: ['./transportation-details.component.css']
})
export class TransportationDetailsComponent implements OnInit {

  transportation: {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private tranServ: TransportationService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.tranServ.read('land', this.route.snapshot.paramMap.get('id')).subscribe(transportation => {
      this.transportation = transportation;
    }, error => {
      this.snackBar.open('Error retrieving the details of this transportation', '', {
        duration: 3000,
      });
      this.router.navigate(['/admin/transportation']);
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
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Transportation deleted`, '', {
            duration: 3000,
          });
          this.router.navigate(['/admin/transportation']);
        });
      }
    });
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivityDeleteDialog } from "../activity-delete-dialog.component";

import { ActivityService } from "../activity.service";
import { EventService } from "../../../event.service";
import { Globals } from "../../../globals";


@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {

  private MEDIA_URL = Globals.MEDIA_URL;

  activity = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private actServ: ActivityService,
    private eventServ: EventService
  ) { }

  ngOnInit() {
    this.actServ.read(this.route.snapshot.paramMap.get('id')).subscribe(activity => {
      this.activity = activity;
    }, error => {
      this.snackBar.open('Error retrieving the details of this activity', '', {
        duration: 3000,
      });
      this.router.navigate(['/admin/activities']);
    });
  }

  delete(id: String) {
    let dialogRef = this.delDialog.open(ActivityDeleteDialog, {
      height: '200px',
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actServ.delete(id).subscribe(res => {
          this.eventServ.broadcast('recount');

          this.snackBar.open(`Activity ${res.name} has been deleted`, '', {
            duration: 3000,
          });
          this.router.navigate(['/admin/activities']);
        });
      }
    });
  }
}

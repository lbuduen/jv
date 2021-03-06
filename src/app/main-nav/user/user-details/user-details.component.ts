import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { UserDeleteDialog } from "../user-delete-dialog.component";

import { UserService } from "../user.service";
import { EventService } from "../../../event.service";
import { Globals } from "../../../globals";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"]
})
export class UserDetailsComponent implements OnInit {
  private MEDIA_URL = Globals.MEDIA_URL;

  user = {};

  constructor(
    private usrv: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private delDialog: MatDialog,
    private eventServ: EventService
  ) {}

  ngOnInit() {
    this.usrv.read(this.route.snapshot.paramMap.get("id")).subscribe(
      user => {
        this.user = user;
      },
      error => {
        this.snackBar.open("Error retrieving the details of this user", "", {
          duration: 3000
        });
        this.router.navigate(["/admin/users"]);
      }
    );
  }

  delete(id: String) {
    const dialogRef = this.delDialog.open(UserDeleteDialog, {
      height: "200px",
      width: "400px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usrv.delete(id).subscribe(
          res => {
            this.eventServ.broadcast("recount");

            this.snackBar.open(`User ${res.firstName} has been deleted`, "", {
              duration: 3000
            });
            this.router.navigate(["/admin/users"]);
          },
          err => {
            if (err.status === 412) {
              this.snackBar.open(
                `User can't be deleted because it is associated to another resource`,
                "",
                {
                  duration: 3000
                }
              );
            }
          }
        );
      }
    });
  }
}

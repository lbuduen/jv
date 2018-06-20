import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from '@angular/material';

import { ActivityService } from "../activity.service";

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css']
})
export class ActivityFormComponent implements OnInit {

  actForm: FormGroup;
  id: String = ''; //activity id

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actServ: ActivityService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.createActivityForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.actServ.read(this.id).subscribe(activity => {
        this.actForm.patchValue(activity);
      }, error => {
        this.snackBar.open(`Error retrieving activity ${this.id}`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/activities']);
      });
    }
  }

  createActivityForm() {
    this.actForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      photos: '',
    });
  }

  save() {
    if (this.id) {
      this.actServ.update(this.id, this.actForm.value).subscribe(res => {
        this.snackBar.open(`Activity ${this.actForm.get('name').value} has been updated`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/activities']);
      });
    }
    else {
      this.actServ.create(this.actForm.value).subscribe(res => {
        this.snackBar.open(`Activity ${this.actForm.get('name').value} has been created`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/activities']);
      });
    }
  }

}

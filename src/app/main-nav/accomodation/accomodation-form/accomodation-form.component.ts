import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from '@angular/material';


import { AccomodationService } from "../accomodation.service";

import { ACCOMODATION_TYPE, ROOM_TYPE, AMENITIES } from "../data.model";

@Component({
  selector: 'app-accomodation-form',
  templateUrl: './accomodation-form.component.html',
  styleUrls: ['./accomodation-form.component.css']
})
export class AccomodationFormComponent implements OnInit {

  accomForm: FormGroup;

  room_types = ROOM_TYPE;
  hotel_types = ACCOMODATION_TYPE;
  amenities = AMENITIES;

  id: String = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accomServ: AccomodationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.createForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.accomServ.read(this.id).subscribe(accom => {
        this.accomForm.patchValue(accom);
      });
    }
  }

  createForm() {
    this.accomForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
      phone: '',
      amenities: '',
      active: true,
      description: '',
      photos: '',
      webpage: '',
      observations: ''
    });
  }

  save() {
    if (this.id) {
      this.accomServ.update(this.id, this.accomForm.value).subscribe(res => {
        this.snackBar.open(`${this.accomForm.get('name').value} ${this.accomForm.get('type').value} has been updated`, '', {
          duration: 3000,
        });
      });
    }
    else {
      this.accomServ.create(this.accomForm.value).subscribe(
        a => console.log(a)
      );
    }
  }

}

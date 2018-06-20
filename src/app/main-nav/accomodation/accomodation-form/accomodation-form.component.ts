import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  roomForm: FormGroup;

  room_types = ROOM_TYPE;
  hotel_types = ACCOMODATION_TYPE;
  amenities = AMENITIES;

  id: String = ''; //accomodation id

  rooms = [];
  selectedRoom: any = false;

  contacts = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accomServ: AccomodationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.accomServ.getAccomodationContacts().subscribe(users => {
      this.contacts = users;
    });

    this.createAccomodationForm();
    this.createRoomForm();

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      this.accomServ.read(this.id).subscribe(accom => {
        this.accomForm.patchValue(accom);
        this.accomForm.patchValue({
          contact: accom.contact._id
        });
        this.rooms = accom.rooms;
      }, error => {
        this.snackBar.open(`Error retrieving accomodation ${this.id}`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/accomodation']);
      });
    }
  }

  createAccomodationForm() {
    this.accomForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: ['', Validators.required],
      phone: '',
      contact: ['', Validators.required],
      amenities: '',
      active: true,
      description: '',
      photos: '',
      webpage: '',
      observations: ''
    });
  }

  createRoomForm() {
    this.roomForm = this.fb.group({
      number: ['', Validators.required],
      type: ['', Validators.required],
      beds: [1, Validators.required],
      available: true,
      description: '',
      observations: '',
      photos: ''
    });
  }

  onFileChange(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      let photos = [];
      files.forEach(photo => {
        reader.readAsDataURL(photo);

        reader.onload = () => {
          let img = window.document.createElement('img');

          photos.push(photo);
        }
      });
      this.accomForm.patchValue({
        photos: photos
      });
      this.cd.markForCheck();
    }
  }

  addRoom() {
    if (this.roomForm.valid) {
      if (this.selectedRoom === false) {
        this.rooms.push(this.roomForm.value);
      }
      else {
        this.rooms[this.selectedRoom] = this.roomForm.value;
        this.selectedRoom = false;
      }
    }
  }

  selectRoom(pos) {
    this.selectedRoom = pos;
    this.roomForm.patchValue(this.rooms[this.selectedRoom]);
  }

  deleteRoom(pos) {
    this.rooms.splice(pos, 1);
  }

  save() {
    let data = this.accomForm.value;
    data['rooms'] = this.rooms;

    if (this.id) {
      this.accomServ.update(this.id, data).subscribe(res => {
        this.snackBar.open(`${this.accomForm.get('name').value} ${this.accomForm.get('type').value} has been updated`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/accomodation']);
      });
    }
    else {
      this.accomServ.create(data).subscribe(res => {
        this.snackBar.open(`${this.accomForm.get('name').value} ${this.accomForm.get('type').value} has been created`, '', {
          duration: 3000,
        });
        this.router.navigate(['/admin/accomodation']);
      });
    }
  }

}
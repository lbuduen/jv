import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from "@angular/material";

import { PackageService } from "../package.service";
import { EventService } from "../../../event.service";

@Component({
  selector: "app-package-form",
  templateUrl: "./package-form.component.html",
  styleUrls: ["./package-form.component.css"]
})
export class PackageFormComponent implements OnInit {
  id: String = ""; //package id

  detailsForm: FormGroup;

  data = new FormData();

  activities = "";
  transportation = [];
  accomodation = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pkgServ: PackageService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private elemRef: ElementRef,
    private eventServ: EventService
  ) {}

  ngOnInit() {
    this.pkgServ.get("accomodation").subscribe(acc => {
      this.accomodation = acc;
    });

    this.pkgServ.get("transportation").subscribe(trans => {
      this.transportation = trans;
    });

    this.pkgServ.get("activities").subscribe(act => {
      this.activities = act;
    });

    this.createDetailsForm();
  }

  createDetailsForm() {
    this.detailsForm = this.fb.group({
      name: ["", Validators.required],
      quota: "",
      startDate: "",
      endDate: "",
      privateRate: "",
      joinerRate: "",
      description: "",
      active: false
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      let gallery: HTMLElement = this.elemRef.nativeElement.querySelector(
        ".gallery"
      );
      gallery.innerHTML = "";

      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.data.append("photos", files[i], files[i].name);

        let reader = new FileReader();
        reader.onload = function() {
          let img: HTMLImageElement = window.document.createElement("img");
          img.src = reader.result;
          img.style.width = "60%";
          img.style.marginBottom = "10px";

          gallery.appendChild(img);
        };
        reader.readAsDataURL(files[i]);
      }
      this.cd.markForCheck();
    }
  }

  deleteAllImages(evt) {
    evt.preventDefault();
    this.data.delete("photos");
    let gallery: HTMLElement = this.elemRef.nativeElement.querySelector(
      ".gallery"
    );
    gallery.innerHTML = "";
  }

  save() {
    let formkeys = Object.keys(this.detailsForm.controls);

    formkeys.forEach(key => {
      this.data.append(key, this.detailsForm.controls[key].value);
    });

    this.pkgServ.create(this.data).subscribe(res => {
      this.eventServ.broadcast("recount");
      this.snackBar.open(
        `Package ${this.detailsForm.get("name").value} has been created`,
        "",
        {
          duration: 3000
        }
      );
      this.router.navigate(["/admin/packages"]);
    });
  }
}

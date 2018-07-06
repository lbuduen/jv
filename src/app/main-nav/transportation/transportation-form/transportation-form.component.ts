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

import { TransportationService } from "../transportation.service";
import { EventService } from "../../../event.service";

@Component({
  selector: "app-transportation-form",
  templateUrl: "./transportation-form.component.html",
  styleUrls: ["./transportation-form.component.css"]
})
export class TransportationFormComponent implements OnInit {
  means = new FormControl("land");
  drivers = [];
  id: String = ""; //transport id

  byLandForm: FormGroup;
  byAirForm: FormGroup;
  data = new FormData();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tranServ: TransportationService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private elemRef: ElementRef,
    private eventServ: EventService
  ) {}

  ngOnInit() {
    this.tranServ.getDrivers().subscribe(users => {
      this.drivers = users;
    });

    this.createByLandForm();
    this.createByAirForm();

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.tranServ.read(this.means.value, this.id).subscribe(
        transport => {
          if (this.means.value == "land") {
            this.byLandForm.patchValue(transport);
            this.byLandForm.patchValue({
              driver: transport.driver._id
            });
          } else {
            this.byAirForm.patchValue(transport);
          }
        },
        error => {
          this.snackBar.open(`Error retrieving transport ${this.id}`, "", {
            duration: 3000
          });
          this.router.navigate(["/admin/transportation"]);
        }
      );
    }
  }

  createByLandForm() {
    this.byLandForm = this.fb.group({
      brand: "",
      model: "",
      plate: "",
      capacity: "",
      color: "",
      driver: "",
      price: "",
      photo: "",
      observations: ""
    });
  }

  createByAirForm() {
    this.byAirForm = this.fb.group({
      company: "",
      flight: "",
      origin: "",
      destination: "",
      departure: "",
      arrival: ""
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
    let form = this.means.value == "land" ? this.byLandForm : this.byAirForm;
    let formkeys = Object.keys(form.controls);

    formkeys.forEach(key => {
      this.data.append(key, form.controls[key].value);
    });

    if (this.id) {
      this.tranServ
        .update(this.means.value, this.id, this.data)
        .subscribe(res => {
          this.snackBar.open(`Transportation updated`, "", {
            duration: 3000
          });
          this.router.navigate(["/admin/transportation"]);
        });
    } else {
      this.tranServ.create(this.means.value, this.data).subscribe(res => {
        this.eventServ.broadcast("recount");

        this.snackBar.open(`Transportation created`, "", {
          duration: 3000
        });
        this.router.navigate(["/admin/transportation"]);
      });
    }
  }
}

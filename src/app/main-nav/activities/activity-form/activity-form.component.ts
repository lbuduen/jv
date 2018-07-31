import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from "@angular/material";

import { ActivityService } from "../activity.service";
import { EventService } from "../../../event.service";

@Component({
  selector: "app-activity-form",
  templateUrl: "./activity-form.component.html",
  styleUrls: ["./activity-form.component.css"]
})
export class ActivityFormComponent implements OnInit {
  actForm: FormGroup;
  data = new FormData();
  id: String = ""; //activity id

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private actServ: ActivityService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private elemRef: ElementRef,
    private eventServ: EventService
  ) {}

  ngOnInit() {
    this.createActivityForm();

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.actServ.read(this.id).subscribe(
        activity => {
          this.actForm.patchValue(activity);
        },
        error => {
          this.snackBar.open(`Error retrieving activity ${this.id}`, "", {
            duration: 3000
          });
          this.router.navigate(["/admin/activities"]);
        }
      );
    }
  }

  createActivityForm() {
    this.actForm = this.fb.group({
      name: ["", Validators.required],
      description: "",
      photos: ""
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
          img.style.height = "200px";
          img.style.marginRight = "12px";

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
    let formkeys = Object.keys(this.actForm.controls);

    formkeys.forEach(key => {
      this.data.append(key, this.actForm.controls[key].value);
    });

    if (this.id) {
      this.actServ.update(this.id, this.data).subscribe(res => {
        this.snackBar.open(
          `Activity ${this.actForm.get("name").value} has been updated`,
          "",
          {
            duration: 3000
          }
        );
        this.router.navigate(["/admin/activities"]);
      });
    } else {
      this.actServ.create(this.data).subscribe(res => {
        this.eventServ.broadcast("recount");
        this.snackBar.open(
          `Activity ${this.actForm.get("name").value} has been created`,
          "",
          {
            duration: 3000
          }
        );
        this.router.navigate(["/admin/activities"]);
      });
    }
  }
}

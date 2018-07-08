import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatSnackBar } from "@angular/material";

import { CustomerService } from "../customer.service";
import { EventService } from "../../../event.service";

import { RATES, STATUS } from "../data.model";

@Component({
  selector: "app-customer-form",
  templateUrl: "./customer-form.component.html",
  styleUrls: ["./customer-form.component.css"]
})
export class CustomerFormComponent implements OnInit {
  rates = RATES;
  status = STATUS;

  id: String = ""; //customer id

  customerForm: FormGroup;
  data = new FormData();

  packages = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customServ: CustomerService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private elemRef: ElementRef,
    private eventServ: EventService
  ) {}

  ngOnInit() {
    this.customServ.getPackages().subscribe(pkgs => {
      this.packages = pkgs;
    });

    this.createCustomerForm();

    this.id = this.route.snapshot.paramMap.get("id");

    if (this.id) {
      this.customServ.read(this.id).subscribe(
        user => {
          this.customerForm.patchValue(user);
        },
        error => {
          this.snackBar.open(`Error retrieving customer ${this.id}`, "", {
            duration: 3000
          });
          this.router.navigate(["/admin/customers"]);
        }
      );
    }
  }

  createCustomerForm() {
    this.customerForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: "",
      email: ["", [Validators.required, Validators.email]],
      phone: "",
      pkg: ["", Validators.required],
      password: ["", Validators.minLength(8)],
      photo: "",
      rate: "joiner",
      status: "requested"
    });
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      let gallery: HTMLElement = this.elemRef.nativeElement.querySelector(
        ".gallery"
      );
      gallery.innerHTML = "";

      const files = event.target.files;
      this.data.append("photo", files[0], files[0].name);

      let reader = new FileReader();
      reader.onload = function() {
        let img: HTMLImageElement = window.document.createElement("img");
        img.src = reader.result;
        img.style.width = "60%";
        img.style.marginBottom = "10px";

        gallery.appendChild(img);
      };
      reader.readAsDataURL(files[0]);
      this.cd.markForCheck();
    }
  }

  deleteAllImages(evt) {
    evt.preventDefault();
    this.data.delete("photo");
    let gallery: HTMLElement = this.elemRef.nativeElement.querySelector(
      ".gallery"
    );
    gallery.innerHTML = "";
  }

  save() {
    let formkeys = Object.keys(this.customerForm.controls);

    formkeys.forEach(key => {
      this.data.append(key, this.customerForm.controls[key].value);
    });

    let pkg = {
      id: this.customerForm.get("pkg").value,
      rate: this.customerForm.get("rate").value,
      status: this.customerForm.get("status").value
    };
    this.data.append("package", JSON.stringify(pkg));

    if (this.id) {
      this.customServ.update(this.id, this.data).subscribe(res => {
        this.snackBar.open(
          `Customer ${
            this.customerForm.get("firstName").value
          } has been updated`,
          "",
          {
            duration: 3000
          }
        );
        this.router.navigate(["/admin/customers"]);
      });
    } else {
      this.customServ.create(this.data).subscribe(res => {
        this.eventServ.broadcast("recount");

        this.snackBar.open(
          `Customer ${
            this.customerForm.get("firstName").value
          } has been created`,
          "",
          {
            duration: 3000
          }
        );
        this.router.navigate(["/admin/customers"]);
      });
    }
  }
}

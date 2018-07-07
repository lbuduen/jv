import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

@Component({
  template: `
    <h2 mat-dialog-title>Add customer</h2>
    <mat-dialog-content>
    <p *ngIf="data.for == 'ride'">{{ data.ride.vehicle.brand }} {{ data.ride.vehicle.model }} [{{ data.ride.vehicle.plate }}]</p>
    <p *ngIf="data.for == 'activity'">{{ data.activist.activity.name }} {{ data.activist.date | date }}</p>

      <mat-form-field>
        <mat-select placeholder="Customers" [formControl]="customerSelect" multiple required>
          <ng-container *ngFor="let c of data.customers">
            <mat-option *ngIf="c.status == 'approved' || c.status == 'paid'" [value]="c">
              {{c.firstName + ' ' + c.lastName}} ({{c.rate}})
            </mat-option>
          </ng-container>
        </mat-select>
      </mat-form-field>

    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button mat-dialog-close>Cancel</button>

      <button *ngIf="data.for == 'ride'"
      mat-raised-button
      color="primary"
      [mat-dialog-close]="customerSelect.value"
      matBadge=" {{ data.ride.vehicle.capacity - data.ride.riders.length }}"
      matBadgeColor="accent"
      [disabled]="customerSelect.invalid || customerSelect.value.length > data.ride.vehicle.capacity - data.ride.riders.length">
        Add
      </button>

      <button *ngIf="data.for == 'activity'"
      mat-raised-button
      color="primary"
      [mat-dialog-close]="customerSelect.value"
      [disabled]="customerSelect.invalid"
      >Add</button>
    </mat-dialog-actions>
    `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin-top: 16px;
        margin-bottom: 35px;
      }
    `
  ]
})
export class AddCustomerToRideDialog {
  customerSelect = new FormControl("", Validators.required);

  constructor(
    public dialogRef: MatDialogRef<AddCustomerToRideDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

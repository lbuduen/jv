import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'delete-dialog',
    template: `
    <h2 mat-dialog-title>Delete transportation</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to delete this transportation?
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      <button mat-button [mat-dialog-close]="true">Yes</button>
    </mat-dialog-actions>
    `,
    styles: [`mat-dialog-content p {margin-top:5px; margin-bottom:35px; }`]
})
export class TransportationDeleteDialog {

    constructor(
        public dialogRef: MatDialogRef<TransportationDeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutModule } from '@angular/cdk/layout';
import {
  MatSliderModule,
  MatCheckboxModule,
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatSnackBarModule,
  MatSelectModule,
  MatTableModule,
  MatMenuModule,
  MatChipsModule,
  MatStepperModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatChipsModule,
    MatStepperModule
  ],
  exports: [
    LayoutModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatChipsModule,
    MatStepperModule
  ],
  declarations: []
})
export class MaterialComponentsModule { }

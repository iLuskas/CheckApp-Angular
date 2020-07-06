import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatSnackBarModule,
    MatSortModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatMenuModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AngularMaterialModule {}

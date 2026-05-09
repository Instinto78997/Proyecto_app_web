import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InventarioFormComponent } from './inventario-form.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [InventarioFormComponent],
  exports: [InventarioFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ]
})
export class InventarioFormModule { }

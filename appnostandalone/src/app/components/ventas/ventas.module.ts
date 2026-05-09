import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasComponent } from './ventas.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [VentasComponent],
  exports: [VentasComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ]
})
export class VentasModule { }

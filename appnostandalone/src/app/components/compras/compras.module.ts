import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasComponent } from './compras.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [ComprasComponent],
  exports: [ComprasComponent],
  imports: [CommonModule, FormsModule, MaterialModule]
})
export class ComprasModule { }

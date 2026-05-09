import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../material.module';
import { InventarioComponent } from './inventario.component';

@NgModule({
  declarations: [InventarioComponent],
  exports: [InventarioComponent],
  imports: [CommonModule, RouterModule, MaterialModule]
})
export class InventarioModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil.component';
import { MaterialModule } from '../../material.module';

@NgModule({
  declarations: [PerfilComponent],
  exports: [PerfilComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class PerfilModule { }

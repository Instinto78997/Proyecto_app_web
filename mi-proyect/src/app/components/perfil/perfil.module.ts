import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilComponent } from './perfil.component';

@NgModule({
  declarations: [PerfilComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [PerfilComponent]
})
export class PerfilModule {}

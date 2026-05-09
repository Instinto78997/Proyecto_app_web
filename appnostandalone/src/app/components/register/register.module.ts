import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  exports: [RegisterComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MaterialModule]
})
export class RegisterModule {}

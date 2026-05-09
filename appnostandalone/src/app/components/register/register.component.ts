import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterDTO } from '../../interfaces/auth.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        nombre: [''],
        telephone: ['', Validators.pattern('^[0-9]*$')],
        bio: ['']
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get usernameControl() {
    return this.registerForm.get('username');
  }

  get emailControl() {
    return this.registerForm.get('email');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }

  get telephoneControl() {
    return this.registerForm.get('telephone');
  }

  passwordMatchValidator(_group: AbstractControl): ValidationErrors | null {
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa los campos correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const telephoneRaw = this.registerForm.value.telephone;
    const userData: RegisterDTO = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      nombre: this.registerForm.value.nombre || undefined,
      telephone: telephoneRaw ? String(telephoneRaw) : undefined,
      bio: this.registerForm.value.bio || undefined
    };

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        if (response && response.success === false) {
          this.isLoading = false;
          this.errorMessage = response.message || 'No se pudo registrar el usuario.';
          return;
        }

        this.isLoading = false;
        this.successMessage = 'Registro exitoso. Redirigiendo al login...';
        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Register error:', error);

        if (error.status === 409 || error.error?.message?.includes('unique')) {
          this.errorMessage = 'El nombre de usuario o correo ya existe.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error al registrar usuario. Intenta de nuevo.';
        }
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

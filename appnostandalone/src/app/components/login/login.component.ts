import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginDTO } from '../../interfaces/auth.dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;
  rememberMe = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }

    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      this.loginForm.patchValue({ username: savedUsername });
      this.rememberMe = true;
    }
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Por favor completa los campos correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.rememberMe) {
      localStorage.setItem('savedUsername', this.loginForm.value.username);
    } else {
      localStorage.removeItem('savedUsername');
    }

    const credentials: LoginDTO = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response && response.success === false) {
          this.isLoading = false;
          this.errorMessage = response.message || 'No se pudo iniciar sesion.';
          return;
        }

        this.authService.setSession(response);
        this.isLoading = false;
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);

        if (typeof error === 'string') {
          this.errorMessage = error;
        } else if (error?.message) {
          if (error.message.includes('no encontrado')) {
            this.errorMessage = 'Usuario no encontrado.';
          } else if (error.message.includes('Contrasena')) {
            this.errorMessage = 'Contrasena incorrecta.';
          } else {
            this.errorMessage = error.message;
          }
        } else {
          this.errorMessage = 'Error al iniciar sesion. Intenta de nuevo.';
        }
      }
    });
  }
}

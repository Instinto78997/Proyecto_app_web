import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nombre: '',
    telephone: '',
    bio: ''
  };

  error = '';
  success = '';
  loading = false;
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private apiService: ApiService, private router: Router) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (!this.user.username || !this.user.password || !this.user.email) {
      this.error = 'Todos los campos obligatorios deben completarse';
      return;
    }

    if (this.user.password !== this.user.confirmPassword) {
      this.error = 'Las contrasenas no coinciden';
      return;
    }

    if (!this.acceptTerms) {
      this.error = 'Debes aceptar terminos y condiciones';
      return;
    }

    this.loading = true;
    this.error = '';

    this.apiService.register({
      username: this.user.username,
      password: this.user.password,
      email: this.user.email,
      nombre: this.user.nombre,
      telephone: this.user.telephone,
      bio: this.user.bio
    }).subscribe({
      next: (response) => {
        this.success = response?.message ?? 'Usuario registrado exitosamente';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (error) => {
        this.error = error?.error?.message ?? 'Error al registrar usuario';
        this.loading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error = '';
  loading = false;
  rememberMe = false;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    const username = this.credentials.username?.trim();
    const password = this.credentials.password?.trim();

    if (!username || !password) {
      this.error = 'Por favor ingresa usuario y contrasena';
      return;
    }

    this.loading = true;
    this.error = '';

    this.apiService.login({ username, password }).subscribe({
      next: (response) => {
        if (response?.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard/home']);
          return;
        }

        this.error = 'Respuesta del servidor invalida';
        this.loading = false;
      },
      error: (error) => {
        this.error = error?.error?.message ?? 'Error al conectar con el servidor';
        this.loading = false;
      }
    });
  }
}

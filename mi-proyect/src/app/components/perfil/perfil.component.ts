import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
  standalone: false
})
export class PerfilComponent implements OnInit {
  profileForm: FormGroup;
  loading = true;
  saving = false;
  successMessage = '';
  errorMessage = '';
  selectedPhoto: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nombre: [''],
      email: [{ value: '', disabled: true }],
      username: [{ value: '', disabled: true }],
      telephone: [''],
      direccion: [''],
      fecha_nacimiento: [''],
      genero: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.authService.obtenerPerfil().subscribe({
      next: (res: any) => {
        const user = res?.user ?? {};
        this.selectedPhoto = user.foto_perfil ?? null;
        this.profileForm.patchValue({
          nombre: user.nombre ?? '',
          email: user.email ?? '',
          username: user.username ?? '',
          telephone: user.telephone ?? '',
          direccion: user.direccion ?? '',
          genero: user.genero ?? '',
          bio: user.bio ?? '',
          fecha_nacimiento: user.fecha_nacimiento ? this.formatDate(user.fecha_nacimiento) : ''
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al cargar perfil';
        this.loading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedPhoto = e.target?.result as string;
      this.guardarFoto(this.selectedPhoto);
    };
    reader.readAsDataURL(file);
  }

  guardarFoto(foto: string): void {
    this.authService.actualizarPerfil({ foto_perfil: foto }).subscribe({
      next: () => this.mostrarMensaje('Foto actualizada', 'success'),
      error: () => this.mostrarMensaje('Error al actualizar foto', 'error')
    });
  }

  guardarPerfil(): void {
    if (this.profileForm.invalid) return;

    this.saving = true;
    const data: any = { ...this.profileForm.getRawValue() };
    if (this.selectedPhoto) {
      data.foto_perfil = this.selectedPhoto;
    }

    this.authService.actualizarPerfil(data).subscribe({
      next: () => {
        this.mostrarMensaje('Perfil actualizado con exito', 'success');
        this.saving = false;
      },
      error: () => {
        this.mostrarMensaje('Error al actualizar los datos', 'error');
        this.saving = false;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private mostrarMensaje(text: string, type: 'success' | 'error'): void {
    if (type === 'success') {
      this.successMessage = text;
      setTimeout(() => (this.successMessage = ''), 3000);
      return;
    }

    this.errorMessage = text;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}

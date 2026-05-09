import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm: FormGroup;
  user: any;
  profileId: number | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  avatarPreview: string | null = null;
  selectedImageName = '';

  generos = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.perfilForm = this.fb.group({
      nombre: [''],
      phone: ['', Validators.pattern('^[0-9]*$')],
      bio: [''],
      firstName: [''],
      lastName: [''],
      address: [''],
      birthDate: [''],
      gender: [''],
      avatarUrl: ['']
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.cargarPerfil();
    }
  }

  cargarPerfil(): void {
    this.isLoading = true;

    this.http.get(`/api/profiles/by-user/${this.user.id}`).subscribe({
      next: (profile: any) => {
        this.isLoading = false;
        this.profileId = profile.id;
        this.perfilForm.patchValue({
          nombre: this.user.nombre || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          address: profile.address || '',
          birthDate: profile.birthDate ? profile.birthDate.split('T')[0] : '',
          gender: profile.gender || '',
          avatarUrl: profile.avatarUrl || ''
        });
        this.avatarPreview = profile.avatarUrl;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error cargando perfil:', error);
        this.perfilForm.patchValue({
          nombre: this.user.nombre || '',
          phone: this.user.telephone || '',
          bio: this.user.bio || ''
        });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.successMessage = '';
    this.errorMessage = '';
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Solo se permiten archivos de imagen.';
      this.limpiarInputFile(event);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.selectedImageName = file.name;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.optimizarImagen(e.target.result)
        .then((base64String) => {
          this.avatarPreview = base64String;
          this.perfilForm.patchValue({ avatarUrl: base64String });
          this.successMessage = 'Foto cargada correctamente';
          this.isLoading = false;

          setTimeout(() => {
            if (this.successMessage === 'Foto cargada correctamente') {
              this.successMessage = '';
            }
          }, 3000);
        })
        .catch(() => {
          this.errorMessage = 'Error al procesar la imagen';
          this.isLoading = false;
          this.limpiarInputFile(event);
        });
    };

    reader.onerror = () => {
      this.errorMessage = 'Error al leer el archivo. Intente nuevamente.';
      this.isLoading = false;
      this.limpiarInputFile(event);
    };

    reader.readAsDataURL(file);
  }

  private optimizarImagen(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 1024;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if (!context) {
          reject();
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      image.onerror = reject;
      image.src = dataUrl;
    });
  }

  private limpiarInputFile(event: any): void {
    event.target.value = '';
  }

  onSubmit(): void {
    if (this.perfilForm.invalid) {
      this.errorMessage = 'Por favor complete los campos correctamente.';
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const userData = {
      username: this.user.username,
      email: this.user.email,
      nombre: this.perfilForm.value.nombre,
      telephone: this.perfilForm.value.phone,
      bio: this.perfilForm.value.bio
    };

    this.http.put(`/api/users/update/${this.user.id}`, userData).subscribe({
      next: () => {
        const profileData = {
          userId: this.user.id,
          firstName: this.perfilForm.value.firstName,
          lastName: this.perfilForm.value.lastName,
          address: this.perfilForm.value.address,
          birthDate: this.perfilForm.value.birthDate,
          phone: this.perfilForm.value.phone,
          bio: this.perfilForm.value.bio,
          gender: this.perfilForm.value.gender,
          avatarUrl: this.perfilForm.value.avatarUrl
        };

        if (this.profileId) {
          this.http.put(`/api/profiles/${this.profileId}`, profileData).subscribe({
            next: () => {
              this.isLoading = false;
              this.successMessage = 'Perfil actualizado correctamente.';
              this.isEditing = false;
              this.actualizarLocalStorage();

              setTimeout(() => {
                if (this.successMessage === 'Perfil actualizado correctamente.') {
                  this.successMessage = '';
                }
              }, 3000);
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error actualizando perfil:', error);
              this.errorMessage = 'Error al actualizar el perfil.';
            }
          });
        } else {
          this.http.post('/api/profiles', profileData).subscribe({
            next: (response: any) => {
              this.isLoading = false;
              this.profileId = response.id;
              this.successMessage = 'Perfil creado correctamente.';
              this.isEditing = false;
              this.actualizarLocalStorage();

              setTimeout(() => {
                if (this.successMessage === 'Perfil creado correctamente.') {
                  this.successMessage = '';
                }
              }, 3000);
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error creando perfil:', error);
              this.errorMessage = 'Error al crear el perfil.';
            }
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error actualizando usuario:', error);
        this.errorMessage = 'Error al actualizar los datos.';
      }
    });
  }

  actualizarLocalStorage(): void {
    this.user.nombre = this.perfilForm.value.nombre;
    this.user.telephone = this.perfilForm.value.phone;
    this.user.bio = this.perfilForm.value.bio;
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    localStorage.setItem('user', JSON.stringify(this.user));
  }
}

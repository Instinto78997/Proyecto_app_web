import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InventarioService } from '../../services/inventario.service';

interface CategoriaOption {
  id: number;
  nombre: string;
}

interface UnidadMedidaOption {
  id: number;
  codigo: string;
  nombre?: string | null;
}

@Component({
  selector: 'app-inventario-form',
  standalone: false,
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.css']
})
export class InventarioFormComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  isView: boolean = false;
  id: number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  pageTitle: string = '';

  categorias: CategoriaOption[] = [];
  unidadesMedida: UnidadMedidaOption[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private inventarioService: InventarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      categoria_id: ['', [Validators.required]],
      peso: ['', [Validators.required, Validators.min(0.01)]],
      unidad_medida_id: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      precio_venta: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    const url = this.route.snapshot.url;
    this.isView = url.some(segment => segment.path === 'ver');
    this.isEdit = url.some(segment => segment.path === 'editar');
    
    if (this.isView) {
      this.pageTitle = 'Ver Alimento';
    } else if (this.isEdit) {
      this.pageTitle = 'Editar Alimento';
    } else {
      this.pageTitle = 'Nuevo Alimento';
    }

    this.cargarCatalogos();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = parseInt(idParam);
      this.cargarDatos();
    }
    
    if (this.isView) {
      this.form.disable();
    }
  }

  cargarCatalogos(): void {
    this.http.get<any>('/api/categorias').subscribe({
      next: (data) => {
        this.categorias = Array.isArray(data) ? data : (data?.categorias ?? []);
      },
      error: (error) => {
        console.error('Error cargando categorias:', error);
      }
    });

    this.http.get<any>('/api/unidades-medida').subscribe({
      next: (data) => {
        this.unidadesMedida = Array.isArray(data) ? data : (data?.medidas ?? []);
      },
      error: (error) => {
        console.error('Error cargando unidades de medida:', error);
      }
    });
  }

  cargarDatos(): void {
    if (!this.id) return;
    
    this.isLoading = true;
    this.inventarioService.getById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nombre: data.nombre,
          categoria_id: data.categoria_id,
          peso: data.peso,
          unidad_medida_id: data.unidad_medida_id,
          stock: data.stock,
          precio_venta: data.precio_venta
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.errorMessage = 'Error al cargar los datos';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const alimento = this.form.value;

    if (this.isEdit && this.id) {
      this.inventarioService.update(this.id, alimento).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/inventario']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error actualizando:', error);
          this.errorMessage = 'Error al actualizar el Alimento';
        }
      });
    } else {
      this.inventarioService.create(alimento).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/inventario']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creando:', error);
          this.errorMessage = 'Error al crear el Alimento';
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/inventario']);
  }
}

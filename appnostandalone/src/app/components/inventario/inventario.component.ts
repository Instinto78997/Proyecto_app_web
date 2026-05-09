import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Alimento } from '../../models/inventario.model';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-inventario',
  standalone: false,
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  alimentos: Alimento[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {
    this.isLoading = true;
    this.inventarioService.getAll().subscribe({
      next: (data) => {
        this.alimentos = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando inventario:', error);
        this.errorMessage = 'Error al cargar el inventario.';
        this.isLoading = false;
      }
    });
  }

  agregar(): void {
    this.router.navigate(['/dashboard/inventario/nuevo']);
  }

  editar(id: number): void {
    this.router.navigate([`/dashboard/inventario/editar/${id}`]);
  }

  ver(id: number): void {
    this.router.navigate([`/dashboard/inventario/ver/${id}`]);
  }

  eliminar(id: number): void {
    if (confirm('Estas seguro de eliminar este alimento?')) {
      this.inventarioService.delete(id).subscribe({
        next: () => {
          this.cargarInventario();
        },
        error: (error) => {
          console.error('Error eliminando:', error);
          this.errorMessage = 'Error al eliminar el alimento.';
        }
      });
    }
  }
}

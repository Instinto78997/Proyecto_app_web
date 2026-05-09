import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Venta {
  id_venta: number;
  nit: string;
  cliente_nombre: string;
  fecha: string;
  metodo_pago: string;
  total: number;
  estado: string;
  estado_pago: string;
}

@Component({
  selector: 'app-compras',
  standalone: false,
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {
  ventas: Venta[] = [];
  filteredVentas: Venta[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  totalVentas: number = 0;

  filtroEstado: string = '';
  filtroMetodoPago: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  metodosPago: any[] = [];
  ventaSeleccionada: Venta | null = null;
  detallesVenta: any[] = [];
  showModal: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarMetodosPago();
  }

  cargarVentas(): void {
    this.isLoading = true;
    this.http.get<any[]>('/api/ventas').subscribe({
      next: (data) => {
        this.ventas = data;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando compras:', error);
        this.errorMessage = 'Error al cargar el historial';
        this.isLoading = false;
      }
    });
  }

  cargarMetodosPago(): void {
    this.http.get<any[]>('/api/metodos-pago').subscribe({
      next: (data) => {
        this.metodosPago = data;
      },
      error: (error) => console.error('Error cargando metodos de pago:', error)
    });
  }

  aplicarFiltros(): void {
    this.filteredVentas = this.ventas.filter(v => {
      let match = true;

      if (this.filtroEstado && v.estado_pago !== this.filtroEstado) {
        match = false;
      }

      if (this.filtroMetodoPago) {
        const metodo = this.metodosPago.find(m => m.nombre === this.filtroMetodoPago);
        if (metodo && v.metodo_pago !== metodo.nombre) {
          match = false;
        }
      }

      if (this.fechaInicio) {
        const fechaVenta = new Date(v.fecha);
        const fechaInicioDate = new Date(this.fechaInicio);
        if (fechaVenta < fechaInicioDate) {
          match = false;
        }
      }

      if (this.fechaFin) {
        const fechaVenta = new Date(v.fecha);
        const fechaFinDate = new Date(this.fechaFin);
        fechaFinDate.setHours(23, 59, 59);
        if (fechaVenta > fechaFinDate) {
          match = false;
        }
      }

      return match;
    });

    this.calcularTotal();
  }

  calcularTotal(): void {
    this.totalVentas = this.filteredVentas.reduce((sum, v) => sum + v.total, 0);
  }

  verDetalle(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.http.get(`/api/ventas/${venta.id_venta}/detalles`).subscribe({
      next: (data: any) => {
        this.detallesVenta = data;
        this.showModal = true;
      },
      error: (error) => console.error('Error cargando detalle:', error)
    });
  }

  cambiarEstado(venta: Venta, nuevoEstado: string): void {
    if (!confirm(`Cambiar estado de compra #${venta.id_venta} a ${nuevoEstado}?`)) {
      return;
    }

    this.http.put(`/api/ventas/${venta.id_venta}/estado-pago`, { estado_pago: nuevoEstado }).subscribe({
      next: () => {
        this.cargarVentas();
      },
      error: (error) => {
        console.error('Error cambiando estado:', error);
        alert('Error al cambiar el estado');
      }
    });
  }

  anularVenta(venta: Venta): void {
    if (!confirm(`Anular compra #${venta.id_venta}? Esta accion no se puede deshacer.`)) {
      return;
    }

    this.http.delete(`/api/ventas/${venta.id_venta}`).subscribe({
      next: () => {
        this.cargarVentas();
      },
      error: (error) => {
        console.error('Error anulando compra:', error);
        alert('Error al anular la compra');
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroMetodoPago = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.aplicarFiltros();
  }

  cerrarModal(): void {
    this.showModal = false;
    this.ventaSeleccionada = null;
    this.detallesVenta = [];
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PAGADO':
        return 'estado-pagado';
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return '';
    }
  }
}

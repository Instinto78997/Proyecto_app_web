import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Cliente {
  nit: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
}

interface Alimento {
  id: number;
  nombre: string;
  precio_venta: number;
  stock: number;
}

interface MetodoPago {
  id_metodo_pago: number;
  nombre: string;
}

interface DetalleVenta {
  id_alimento: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas',
  standalone: false,
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  clientes: Cliente[] = [];
  alimentos: Alimento[] = [];
  metodosPago: MetodoPago[] = [];

  selectedCliente: string = 'CF';
  selectedMetodoPago: number = 1;
  detalles: DetalleVenta[] = [];

  alimentoSeleccionado: number = 0;
  cantidad: number = 1;

  total: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarAlimentos();
    this.cargarMetodosPago();
  }

  cargarClientes(): void {
    this.http.get<Cliente[]>('/api/clientes').subscribe({
      next: (data) => {
        this.clientes = data;
        if (!this.clientes.find(c => c.nit === 'CF')) {
          this.clientes.unshift({ nit: 'CF', nombre: 'Consumidor Final' });
        }
      },
      error: (error) => console.error('Error cargando clientes:', error)
    });
  }

  cargarAlimentos(): void {
    this.http.get<Alimento[]>('/api/alimentos').subscribe({
      next: (data) => {
        this.alimentos = data.filter(a => a.stock > 0);
      },
      error: (error) => console.error('Error cargando alimentos:', error)
    });
  }

  cargarMetodosPago(): void {
    this.http.get<MetodoPago[]>('/api/metodos-pago').subscribe({
      next: (data) => {
        this.metodosPago = data;
      },
      error: (error) => console.error('Error cargando metodos de pago:', error)
    });
  }

  agregarAlimento(): void {
    const alimentoId = Number(this.alimentoSeleccionado);
    const cantidadNum = Number(this.cantidad);

    if (!alimentoId || alimentoId <= 0 || cantidadNum <= 0) {
      this.errorMessage = 'Seleccione un alimento y una cantidad valida';
      return;
    }

    const alimento = this.alimentos.find(a => a.id === alimentoId);

    if (!alimento) {
      this.errorMessage = 'Alimento no encontrado';
      return;
    }

    if (alimento.stock < cantidadNum) {
      this.errorMessage = `Stock insuficiente. Solo hay ${alimento.stock} unidades`;
      return;
    }

    const subtotal = alimento.precio_venta * cantidadNum;
    const detalleExistente = this.detalles.find(d => d.id_alimento === alimentoId);

    if (detalleExistente) {
      detalleExistente.cantidad += cantidadNum;
      detalleExistente.subtotal = detalleExistente.cantidad * detalleExistente.precio_unitario;
    } else {
      this.detalles.push({
        id_alimento: alimento.id,
        nombre: alimento.nombre,
        cantidad: cantidadNum,
        precio_unitario: alimento.precio_venta,
        subtotal
      });
    }

    this.calcularTotal();
    this.alimentoSeleccionado = 0;
    this.cantidad = 1;
    this.errorMessage = '';
  }

  eliminarDetalle(index: number): void {
    this.detalles.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.detalles.reduce((sum, d) => sum + d.subtotal, 0);
  }

  realizarVenta(): void {
    if (this.detalles.length === 0) {
      this.errorMessage = 'Agregue al menos un alimento a la venta';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const ventaData = {
      nit: this.selectedCliente,
      id_metodo_pago: this.selectedMetodoPago,
      detalles: this.detalles.map(d => ({
        id_alimento: d.id_alimento,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario
      }))
    };

    this.http.post('/api/ventas', ventaData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Venta realizada con exito');
        this.detalles = [];
        this.calcularTotal();
        this.cargarAlimentos();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error realizando venta:', error);
        this.errorMessage = error.error?.message || 'Error al realizar la venta';
      }
    });
  }

  nuevoCliente(): void {
    const nombre = prompt('Ingrese el nombre del cliente:');
    if (nombre) {
      const nit = prompt('Ingrese el NIT del cliente (o "CF" para consumidor final):') || 'CF';
      this.http.post('/api/clientes', { nit, nombre }).subscribe({
        next: (response: any) => {
          this.cargarClientes();
          this.selectedCliente = response.nit;
          alert('Cliente creado con exito');
        },
        error: (error) => {
          console.error('Error creando cliente:', error);
          alert('Error al crear el cliente');
        }
      });
    }
  }
}

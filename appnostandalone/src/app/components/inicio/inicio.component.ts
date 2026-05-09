import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: false,
  template: `
    <section class="inicio-container page-shell">
      <div class="page-title">
        <div>
          <p class="eyebrow">Operacion diaria</p>
          <h1>Bienvenido, {{ user?.nombre || user?.username }}</h1>
          <p class="subtitle">Resumen ejecutivo para inventario, ventas y compras.</p>
        </div>
      </div>

      <div class="metric-grid">
        <mat-card>
          <span class="metric-label">Inventario</span>
          <strong>Productos y stock</strong>
          <p>Controla existencias, precios y unidades de medida.</p>
        </mat-card>
        <mat-card>
          <span class="metric-label accent">Ventas</span>
          <strong>Registro rapido</strong>
          <p>Agrega alimentos, calcula subtotales y descuenta stock.</p>
        </mat-card>
        <mat-card>
          <span class="metric-label success">Compras</span>
          <strong>Seguimiento</strong>
          <p>Consulta estados de pago y detalle de movimientos.</p>
        </mat-card>
      </div>
    </section>
  `,
  styles: [`
    .inicio-container {
      min-height: calc(100vh - 170px);
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    mat-card {
      padding: 20px;
      display: grid;
      gap: 10px;
      border-top: 5px solid var(--primary);
    }

    mat-card:nth-child(2) {
      border-top-color: var(--accent);
      background: linear-gradient(180deg, #ffffff 0%, var(--accent-soft) 160%) !important;
    }

    mat-card:nth-child(3) {
      border-top-color: var(--success);
      background: linear-gradient(180deg, #ffffff 0%, var(--success-soft) 160%) !important;
    }

    mat-card strong {
      font-size: 1.2rem;
      color: var(--text-main);
    }

    mat-card p {
      margin: 0;
      color: var(--text-soft);
    }

    .metric-label {
      color: var(--primary);
      font-weight: 800;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .metric-label.accent {
      color: var(--accent);
    }

    .metric-label.success {
      color: var(--success);
    }

    @media (max-width: 900px) {
      .metric-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InicioComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
}

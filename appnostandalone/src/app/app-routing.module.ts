import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { InventarioComponent } from './components/inventario/inventario.component';
import { InventarioFormComponent } from './components/inventario-form/inventario-form.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ComprasComponent } from './components/compras/compras.component';
import { AuthGuard } from './guards/auth.guard';
import { FriendsComponent } from './components/friends/friends.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'friends', component: FriendsComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'inventario/nuevo', component: InventarioFormComponent },
      { path: 'inventario/editar/:id', component: InventarioFormComponent },
      { path: 'inventario/ver/:id', component: InventarioFormComponent },
      { path: 'ventas', component: VentasComponent },
      { path: 'compras', component: ComprasComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ComprasModule } from './components/compras/compras.module';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { InventarioFormModule } from './components/inventario-form/inventario-form.module';
import { InventarioModule } from './components/inventario/inventario.module';
import { LoginModule } from './components/login/login.module';
import { PerfilModule } from './components/perfil/perfil.module';
import { RegisterModule } from './components/register/register.module';
import { VentasModule } from './components/ventas/ventas.module';
import { AuthTokenInterceptor } from './interceptors/auth-token.interceptor';
import { FriendsComponent } from './components/friends/friends.component';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [AppComponent, DashboardComponent, InicioComponent, FriendsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    RegisterModule,
    PerfilModule,
    InventarioModule,
    InventarioFormModule,
    HeaderModule,
    FooterModule,
    VentasModule,
    MaterialModule,
    ComprasModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginModule } from './components/login/login.module';
import { RegisterModule } from './components/register/register.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { HomeModule } from './components/home/home.module';
import { PerfilModule } from './components/perfil/perfil.module';
import { AlertModule } from './components/alert/alert.module';
import { UserModule } from './components/user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    RegisterModule,
    DashboardModule,
    HomeModule,
    PerfilModule,
    AlertModule,
    UserModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

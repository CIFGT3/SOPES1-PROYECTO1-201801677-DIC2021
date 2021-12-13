import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MemoriaComponent } from './components/memoria/memoria.component';
import { CpuComponent } from './components/cpu/cpu.component';
import { ProcesoComponent } from './components/proceso/proceso.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ArbolComponent } from './components/arbol/arbol.component';

import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InicioComponent,
    MemoriaComponent,
    CpuComponent,
    ProcesoComponent,
    ArbolComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatListModule,
    MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

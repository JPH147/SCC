import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

// Cookies
import { CookieService } from 'ngx-cookie-service' ;

import { MaterialModule } from './material/material.module';
import { CoreModule } from './core/core.module';
import { CompartidoModule } from './compartido/compartido.module';

import { StoreModule } from '@ngrx/store';
import { ReducersGlobales } from './compartido/reducers/estados';

/* Imports del software */
import {AppComponent} from './app.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import { ventanaseriessv } from './components/salida-vendedores/ventana-seriessv/ventanaseriessv';
import { VentanaEmergenteGastos } from './components/listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';
import { ImageUploadModule } from 'angular2-image-upload';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { VentanaProductosComponent } from './components/ventas/ventana-productos/ventana-productos.component';
import { ComisionesDetalleComponent } from './components/comisiones/comisiones-detalle/comisiones-detalle.component';
import { VentanaCronogramaComponent } from './components/ventas/ventana-cronograma/ventana-cronograma.component';
import { AgregarVentaComponent } from './components/retorno-vendedores/agregar-venta/agregar-venta.component';
import { RetornoVendedoresCierreComponent } from './components/retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { VentasSalidaComponent } from './components/ventas-salida/ventas-salida.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { CreditosListarComponent } from './components/creditos-listar/creditos-listar.component';
import { VentanaTrabajadoresComponent } from './components/trabajadores/ventana-trabajador/ventana-trabajador.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { VentanaArchivosComponent } from './components/presupuesto/ventana-archivos/ventana-archivos.component';
import { CreditosListarAfiliacionesComponent } from './components/creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { AfiliacionesComponent } from './components/afiliaciones/afiliaciones.component';

@NgModule({
  exports:[
    RouterModule
  ],
  imports: [
    BrowserModule ,
    BrowserAnimationsModule ,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule ,
    CoreModule ,
    CompartidoModule ,
    AppRoutingModule ,
    ImageUploadModule.forRoot(),
    StoreModule.forRoot(ReducersGlobales) ,
  ],
  declarations: [
    AppComponent,
    SalidaVendedoresComponent,
    RetornoVendedoresComponent,
    ComisionesComponent,
    VentasComponent,
    ListadoSalidaVendedoresComponent,
    ventanaseriessv,
    VentanaEmergenteGastos,
    VentasListarComponent,
    VentanaProductosComponent,
    ComisionesDetalleComponent,
    VentanaCronogramaComponent,
    AgregarVentaComponent,
    RetornoVendedoresCierreComponent,
    VentasSalidaComponent,
    CreditosComponent,
    CreditosListarComponent,
    TrabajadoresComponent,
    RegistroHorasComponent,
    ReporteAsistenciaComponent,
    VentanaTrabajadoresComponent,
    PresupuestoComponent,
    VentanaArchivosComponent,
    CreditosListarAfiliacionesComponent,
    RefinanciamientoComponent,
    AfiliacionesComponent,
   ],
  bootstrap: [AppComponent],
  providers: [
    CookieService ,
  ]
})



export class AppModule {}

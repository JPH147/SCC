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
import { CobranzasListarComponent } from './components/cobranzas-listar/cobranzas-listar.component';
import { CobranzaPnpComponent } from './components/cobranza-archivos/cobranza-pnp/cobranza-pnp.component';
import { CobranzaArchivosListarComponent } from './components/cobranza-archivos-listar/cobranza-archivos-listar.component';
import { CobranzaArchivosComponent } from './components/cobranza-archivos/cobranza-archivos.component';
import { CobranzaArchivosPagoComponent } from './components/cobranza-archivos-pago/cobranza-archivos-pago.component';
import { VentanaTrabajadoresComponent } from './components/trabajadores/ventana-trabajador/ventana-trabajador.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { VentanaArchivosComponent } from './components/presupuesto/ventana-archivos/ventana-archivos.component';
import { CreditosListarAfiliacionesComponent } from './components/creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { CobranzaDirectaComponent } from './components/cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './components/cobranza-directa-listar/cobranza-directa-listar.component';
import { VentanaPagosComponent } from './components/cobranzas-listar/ventana-pagos/ventana-pagos.component';
import { VentanaTipoReporteComponent } from './components/cobranzas-listar/ventana-tipo-reporte/ventana-tipo-reporte.component';
import { VentanaEditarPagoComponent } from './components/cobranzas-listar/ventana-editar-pago/ventana-editar-pago.component';
import { CobranzaArchivosDetalleComponent } from './components/cobranza-archivos-detalle/cobranza-archivos-detalle.component';
import { CobranzaJudicialListarComponent } from './components/cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './components/cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialGenerarComponent } from './components/cobranza-judicial-generar/cobranza-judicial-generar.component';
import { CobranzaClienteListarComponent } from './components/cobranza-cliente-listar/cobranza-cliente-listar.component';
import { VentanaJudicialComponent } from './components/cobranza-judicial/ventana-judicial/ventana-judicial.component';
import { VentanaCambioDistritoComponent } from './components/cobranza-judicial-listar/ventana-cambio-distrito/ventana-cambio-distrito.component';
import { CobranzaJudicialMultipleComponent } from './components/cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { VentanaCobranzaClienteComponent } from './components/cobranza-cliente-listar/ventana-cobranza-cliente/ventana-cobranza-cliente.component';
import { VentanaCobranzaClienteVencidasComponent } from './components/cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component';
import { CobranzaClienteListarMorososComponent } from './components/cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';

import { VentanaEditarCuotasComponent } from './components/cobranza-archivos/cobranza-pnp/ventana-editar-cuotas/ventana-editar-cuotas.component';
import { CobranzaManualComponent } from './components/cobranza-manual/cobranza-manual.component';
import { VentanaCrearCobranzaManualComponent } from './components/cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component';
import { CobranzaManualListarComponent } from './components/cobranza-manual-listar/cobranza-manual-listar.component';
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
    CobranzaArchivosComponent,
    CobranzasListarComponent,
    CobranzaPnpComponent,
    CobranzaArchivosListarComponent,
    TrabajadoresComponent,
    RegistroHorasComponent,
    ReporteAsistenciaComponent,
    VentanaTrabajadoresComponent,
    PresupuestoComponent,
    VentanaArchivosComponent,
    CreditosListarAfiliacionesComponent,
    RefinanciamientoComponent,
    CobranzaDirectaComponent,
    CobranzaDirectaListarComponent,
    VentanaPagosComponent,
    CobranzaArchivosPagoComponent,
    VentanaTipoReporteComponent,
    VentanaEditarPagoComponent,
    CobranzaArchivosDetalleComponent,
    CobranzaJudicialListarComponent,
    CobranzaJudicialComponent,
    CobranzaClienteListarComponent,
    VentanaJudicialComponent,
    CobranzaJudicialGenerarComponent,
    VentanaCambioDistritoComponent,
    CobranzaJudicialMultipleComponent,
    VentanaCobranzaClienteComponent,
    VentanaCobranzaClienteVencidasComponent,
    CobranzaClienteListarMorososComponent,
    VentanaEditarCuotasComponent,
    CobranzaManualComponent,
    VentanaCrearCobranzaManualComponent,
    CobranzaManualListarComponent,
    AfiliacionesComponent,
   ],
  bootstrap: [AppComponent],
  providers: [
    CookieService ,
  ]
})



export class AppModule {}

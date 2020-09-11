import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModuloCobranzasRoutingModule } from './modulo-cobranzas-routing.module';
import { CobranzaArchivosComponent } from './cobranza-archivos/cobranza-archivos.component';
import { CobranzaPnpComponent } from './cobranza-archivos/cobranza-pnp/cobranza-pnp.component';
import { CobranzaArchivosDetalleComponent } from './cobranza-archivos-detalle/cobranza-archivos-detalle.component';
import { CobranzaArchivosListarComponent } from './cobranza-archivos-listar/cobranza-archivos-listar.component';
import { CobranzaArchivosPagoComponent } from './cobranza-archivos-pago/cobranza-archivos-pago.component';
import { CobranzaClienteListarComponent } from './cobranza-cliente-listar/cobranza-cliente-listar.component';
import { VentanaCobranzaClienteComponent } from './cobranza-cliente-listar/ventana-cobranza-cliente/ventana-cobranza-cliente.component';
import { VentanaCobranzaClienteVencidasComponent } from './cobranza-cliente-listar/ventana-cobranza-cliente-vencidas/ventana-cobranza-cliente-vencidas.component';
import { CobranzaClienteListarMorososComponent } from './cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';
import { CobranzaDirectaComponent } from './cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './cobranza-directa-listar/cobranza-directa-listar.component';
import { CobranzaJudicialComponent } from './cobranza-judicial/cobranza-judicial.component';
import { VentanaJudicialComponent } from './cobranza-judicial/ventana-judicial/ventana-judicial.component';
import { CobranzaJudicialListarComponent } from './cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialGenerarComponent } from './cobranza-judicial-generar/cobranza-judicial-generar.component';
import { VentanaCambioDistritoComponent } from './cobranza-judicial-listar/ventana-cambio-distrito/ventana-cambio-distrito.component';
import { CobranzaJudicialMultipleComponent } from './cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { CobranzaManualComponent } from './cobranza-manual/cobranza-manual.component';
import { VentanaCrearCobranzaManualComponent } from './cobranza-manual/ventana-crear-cobranza-manual/ventana-crear-cobranza-manual.component';
import { CobranzaManualListarComponent } from './cobranza-manual-listar/cobranza-manual-listar.component';
import { CobranzasListarComponent } from './cobranzas-listar/cobranzas-listar.component';
import { VentanaEditarPagoComponent } from './cobranzas-listar/ventana-editar-pago/ventana-editar-pago.component';
import { VentanaTipoReporteComponent } from './cobranzas-listar/ventana-tipo-reporte/ventana-tipo-reporte.component';
import { VentanaEditarCuotasComponent } from './cobranza-archivos/cobranza-pnp/ventana-editar-cuotas/ventana-editar-cuotas.component';

@NgModule({
  declarations: [
    CobranzaArchivosComponent ,
    CobranzaPnpComponent ,
    VentanaEditarCuotasComponent ,
    CobranzaArchivosDetalleComponent ,
    CobranzaArchivosListarComponent ,
    CobranzaArchivosPagoComponent ,
    CobranzaClienteListarComponent ,
    VentanaCobranzaClienteComponent ,
    VentanaCobranzaClienteVencidasComponent ,
    CobranzaClienteListarMorososComponent ,
    CobranzaDirectaComponent ,
    CobranzaDirectaListarComponent ,
    CobranzaJudicialComponent ,
    VentanaJudicialComponent ,
    CobranzaJudicialComponent ,
    CobranzaJudicialListarComponent ,
    CobranzaJudicialGenerarComponent ,
    VentanaCambioDistritoComponent ,
    CobranzaJudicialMultipleComponent ,
    CobranzaManualComponent ,
    VentanaCrearCobranzaManualComponent ,
    CobranzaManualListarComponent ,
    CobranzasListarComponent ,
    VentanaEditarPagoComponent ,
    VentanaTipoReporteComponent ,
  ],
  imports: [
    ModuloCobranzasRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    CompartidoModule ,
    MaterialModule ,
    ImageUploadModule ,
  ]
})
export class ModuloCobranzasModule { }

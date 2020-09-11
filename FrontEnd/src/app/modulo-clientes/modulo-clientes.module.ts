import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material/material.module';
import { ImageUploadModule } from 'angular2-image-upload';
import { ModuloClientesRoutingModule } from './modulo-clientes-routing.module';

import { CompartidoModule } from '../compartido/compartido.module';

import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { EvaluacionExpressComponent } from './evaluacion/evaluacion-express/evaluacion-express.component';
import { SeguimientosComponent } from './seguimientos/seguimientos.component';
import { AgregarProductoComponent } from './evaluacion/agregar-producto/agregar-producto.component';
import { EvaluacionArchivosComponent } from './evaluacion/evaluacion-archivos/evaluacion-archivos.component';
import { EvaluacionCapacidadComponent } from './evaluacion/evaluacion-capacidad/evaluacion-capacidad.component';
import { EvaluacionCuotasComponent } from './evaluacion/evaluacion-cuotas/evaluacion-cuotas.component';
import { EvaluacionOrdenComponent } from './evaluacion/evaluacion-orden/evaluacion-orden.component';
import { VerPlantillasComponent } from './evaluacion/ver-plantillas/ver-plantillas.component';
import { VentanaEntregaSeguimientosComponent } from './ventana-entrega-seguimientos/ventana-entrega-seguimientos.component';
import { VentanaSeguimientosComponent } from './ventana-seguimientos/ventana-seguimientos.component';
import { FileUpload } from './file-upload/fileupload';
import { ClientesComponent } from './clientes/clientes.component';
import { VentanaRelacionadosComponent } from './clientes/ventana-relacionados/ventana-relacionados.component';
import { VentanaEmergenteIntegralAgregarComponent } from './ventana-emergente-integral-agregar/ventana-emergente-integral-agregar.component';
import { VentanaEmergenteIntegralEditarComponent } from './ventana-emergente-integral-editar/ventana-emergente-integral-editar.component';
import { VentanaEmergenteProvisionalClientes } from './ventana-emergente-provisional/ventanaemergenteprovisional';
import { VentanaLlamadasComponent } from './clientes/ventana-relacionados/ventana-llamadas/ventana-llamadas.component';
import { VentanaObservacionesComponent } from './clientes/ventana-relacionados/ventana-observaciones/ventana-observaciones.component';

@NgModule({
  declarations: [
    EvaluacionComponent ,
    EvaluacionExpressComponent ,
    SeguimientosComponent ,
    AgregarProductoComponent ,
    EvaluacionArchivosComponent ,
    EvaluacionCapacidadComponent ,
    EvaluacionCuotasComponent ,
    EvaluacionExpressComponent ,
    EvaluacionOrdenComponent ,
    VerPlantillasComponent ,
    VentanaEntregaSeguimientosComponent ,
    VentanaSeguimientosComponent ,
    FileUpload ,
    ClientesComponent ,
    VentanaRelacionadosComponent ,
    VentanaEmergenteIntegralAgregarComponent,
    VentanaEmergenteIntegralEditarComponent ,
    VentanaEmergenteProvisionalClientes ,
    VentanaLlamadasComponent ,
    VentanaObservacionesComponent ,
  ],
  imports: [
    ModuloClientesRoutingModule ,
    CommonModule ,
    RouterModule ,
    FormsModule ,
    ReactiveFormsModule ,
    CompartidoModule ,
    MaterialModule ,
    ImageUploadModule ,
  ]
})
export class ModuloClientesModule { }

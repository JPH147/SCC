import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModuloVentasRoutingModule } from './modulo-ventas-routing.module';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { ComisionesDetalleComponent } from './comisiones/comisiones-detalle/comisiones-detalle.component';
import { ListadoSalidaVendedoresComponent } from './listado-salida-vendedores/listado-salida-vendedores.component';
import { VentanaEmergenteGastos } from './listado-salida-vendedores/ventana-emergente-gastos/ventanaemergente-gastos';
import { RetornoVendedoresComponent } from './retorno-vendedores/retorno-vendedores.component';
import { AgregarVentaComponent } from './retorno-vendedores/agregar-venta/agregar-venta.component';
import { RetornoVendedoresCierreComponent } from './retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { SalidaVendedoresComponent } from './salida-vendedores/salida-vendedores.component';
import { ventanaseriessv } from './salida-vendedores/ventana-seriessv/ventanaseriessv';
import { VentasComponent } from './ventas/ventas.component';
import { VentanaProductosComponent } from './ventas/ventana-productos/ventana-productos.component';
import { VentanaCronogramaComponent } from './ventana-cronograma/ventana-cronograma.component';
import { VentasListarComponent } from './ventas-listar/ventas-listar.component';
import { VentasSalidaComponent } from './ventas-salida/ventas-salida.component';

@NgModule({
  declarations: [
    ComisionesComponent ,
    ComisionesDetalleComponent ,
    ListadoSalidaVendedoresComponent ,
    VentanaEmergenteGastos ,
    RetornoVendedoresComponent ,
    AgregarVentaComponent ,
    RetornoVendedoresCierreComponent ,
    SalidaVendedoresComponent ,
    ventanaseriessv ,
    VentasComponent ,
    VentanaProductosComponent ,
    VentanaCronogramaComponent ,
    VentasListarComponent ,
    VentasSalidaComponent ,
  ],
  imports: [
    ModuloVentasRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    CompartidoModule ,
    MaterialModule ,
    ImageUploadModule ,
  ]
})
export class ModuloVentasModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModuloInventariosRoutingModule } from './modulo-inventarios-routing.module';
import { DetalleDocumentoAlmacenComponent } from './detalle-documento-almacen/detalle-documento-almacen.component';
import { VentanaEditarDocumentoComponent } from './detalle-documento-almacen/ventana-editar-documento/ventana-editar-documento.component';
import { VentanaEditarSerieComponent } from './detalle-documento-almacen/ventana-editar-serie/ventana-editar-serie.component';
import { DetalleProductosComponent } from './detalleproductos/detalleproductos.component';
import { ProductosComponent } from './detalleproductos/productos/productos.component';
import { MarcaComponent } from './detalleproductos/marca/marca.component';
import { ModeloComponent } from './detalleproductos/modelo/modelo.component';
import { TipoComponent } from './detalleproductos/tipo/tipo.component';
import { HistorialMovimientosComponent } from './historial-movimientos/historial-movimientos.component';
import { HistorialSerieComponent } from './historial-serie/historial-serie.component';
import { IngresoProductosComponent } from './ingreso-productos/ingreso-productos.component';
import { VentanaDetalle } from './ingreso-productos/ventana-detalle/ventanadetalle';
import { VentanaFecha } from './ingreso-productos/ventana-fecha/ventanafecha';
import { ventanaseries } from './ingreso-productos/ventana-series/ventanaseries';
import { SalidaProductosComponent } from './salida-productos/salida-productos.component';
import { ventanaseriesalida } from './salida-productos/ventana-seriesalida/ventanaseriesalida';
import { StockComponent } from './stock/stock.component';
import { VentanaEmergenteStock } from './stock/ventana-emergentestock/ventanaemergentestock';
import { ImagenProductoComponent } from './detalleproductos/productos/imagen-producto/imagen-producto.component';
import { VentanaEmergenteProductos } from './detalleproductos/productos/ventana-emergente/ventanaemergente';
import { VentanaEmergenteMarca } from './detalleproductos/marca/ventana-emergente/ventanaemergente';
import { VentanaEmergenteModelo } from './detalleproductos/modelo/ventana-emergente/ventanaemergente';
import { VentanaEmergenteTipo } from './detalleproductos/tipo/ventana-emergente/ventanaemergente';

@NgModule({
  declarations: [
    DetalleDocumentoAlmacenComponent ,
    VentanaEditarDocumentoComponent ,
    VentanaEditarSerieComponent ,
    DetalleProductosComponent ,
    ProductosComponent ,
    MarcaComponent ,
    ModeloComponent ,
    TipoComponent ,
    HistorialMovimientosComponent ,
    HistorialSerieComponent ,
    IngresoProductosComponent ,
    VentanaDetalle ,
    VentanaFecha ,
    ventanaseries ,
    SalidaProductosComponent ,
    ventanaseriesalida ,
    StockComponent ,
    VentanaEmergenteStock ,
    ImagenProductoComponent ,
    VentanaEmergenteProductos ,
    VentanaEmergenteMarca ,
    VentanaEmergenteModelo ,
    VentanaEmergenteTipo ,
  ],
  imports: [
    ModuloInventariosRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    MaterialModule ,
    CompartidoModule ,
    ImageUploadModule ,
  ]
})
export class ModuloInventariosModule { }

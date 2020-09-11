import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosComponent } from './detalleproductos/productos/productos.component';
import { DetalleProductosComponent } from './detalleproductos/detalleproductos.component';
import { HistorialSerieComponent } from './historial-serie/historial-serie.component';
import { HistorialMovimientosComponent } from './historial-movimientos/historial-movimientos.component';
import { DetalleDocumentoAlmacenComponent } from './detalle-documento-almacen/detalle-documento-almacen.component';
import { StockComponent } from './stock/stock.component';
import { IngresoProductosComponent } from './ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './salida-productos/salida-productos.component';

const routes: Routes = [
  {path: '', redirectTo: 'stock', pathMatch: 'full'} ,
  {path: 'productos', component: ProductosComponent},
  {path: 'detalleproductos', component: DetalleProductosComponent},
  {path: 'series', component: HistorialSerieComponent},
  {path: 'movimientos', component: HistorialMovimientosComponent},
  {path: 'movimientos/ver/:id', component: DetalleDocumentoAlmacenComponent},
  {path: 'movimientos/editar/:ideditar', component: DetalleDocumentoAlmacenComponent},
  {path: 'stock', component: StockComponent},
  {path: 'stock/ingresoproductos', component: IngresoProductosComponent},
  {path: 'stock/salidaproductos', component: SalidaProductosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloInventariosRoutingModule { }

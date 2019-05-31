import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ProductosComponent } from './components/productos/productos.component';
import { StockComponent } from './components/stock/stock.component';
import { IngresoProductosComponent } from './components/ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { HistorialSerieComponent } from './components/historial-serie/historial-serie.component';
import { HistorialMovimientosComponent } from './components/historial-movimientos/historial-movimientos.component';
import { DetalleProductosComponent } from './components/detalleproductos/detalleproductos.component';
import { DetalleDocumentoAlmacenComponent } from './components/detalle-documento-almacen/detalle-documento-almacen.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
import { ReglasEvaluacionComponent } from './components/tablas-maestras/reglas-evaluacion/reglas-evaluacion.component';
import { RetornoVendedoresCierreComponent } from './components/retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { VentasSalidaComponent } from './components/ventas-salida/ventas-salida.component';
import { CreditosListarComponent } from './components/creditos-listar/creditos-listar.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { CobranzasComponent } from './components/cobranzas/cobranzas.component';
import { CobranzasListarComponent } from './components/cobranzas-listar/cobranzas-listar.component';

const appRoutes: Routes = [
  // {path: '', component: EvaluacionComponent}, //prueba
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'productos', component: ProductosComponent},
  {path: 'series', component: HistorialSerieComponent},
  {path: 'evaluacion', component: EvaluacionComponent},
  {path: 'movimientos', component: HistorialMovimientosComponent},
  {path: 'movimientos/:id', component: DetalleDocumentoAlmacenComponent},
  {path: 'stock', component: StockComponent},
  {path: 'stock/ingresoproductos', component: IngresoProductosComponent},
  {path: 'stock/salidaproductos', component: SalidaProductosComponent},
  {path: 'salidavendedores', component: ListadoSalidaVendedoresComponent},
  {path: 'salidavendedores/ver/:idsalida', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/editar/:idsalidaeditar', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/ingreso', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/rendicion/:idsalida', component: RetornoVendedoresComponent},
  {path: 'salidavendedores/retorno/:idsalida', component: RetornoVendedoresCierreComponent},
  {path: 'comisiones', component: ComisionesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'ventas', component: VentasListarComponent},
  {path: 'ventas/nueva', component: VentasComponent},
  {path: 'ventas/nueva/:idcliente', component: VentasComponent},
  {path: 'ventas/nueva/:idventacanje/:idcliente', component: VentasComponent},
  {path: 'ventas/editar/:ideditar', component: VentasComponent},
  {path: 'ventas/:idventa', component: VentasComponent},
  {path: 'ventas/salida/:idventa', component: VentasSalidaComponent},
  {path: 'ventas/salida/editar/:idventaeditar', component: VentasSalidaComponent},
  {path: 'creditos', component: CreditosListarComponent},
  {path: 'creditos/ver/:idcredito', component: CreditosComponent},
  {path: 'creditos/editar/:idcreditoeditar', component: CreditosComponent},
  {path: 'creditos/nuevo', component: CreditosComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'direcciones', component: DireccionesComponent},
  {path: 'detalleproductos', component: DetalleProductosComponent},
  {path: 'evaluacion-reglas', component: ReglasEvaluacionComponent},
  {path: 'cobranzas', component: CobranzasListarComponent},
  {path: 'prueba', component: CobranzasComponent}
];

export const appRoutingProvider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


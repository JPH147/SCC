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
import { ventanaseries } from './components/ingreso-productos/ventana-series/ventanaseries';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { ventanaseriessv } from './components/salida-vendedores/ventana-seriessv/ventanaseriessv';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { HistorialSerieComponent } from './components/historial-serie/historial-serie.component';
import { HistorialMovimientosComponent } from './components/historial-movimientos/historial-movimientos.component';
import { DetalleProductosComponent } from './components/detalleproductos/detalleproductos.component';
import { DetalleDocumentoAlmacenComponent } from './components/detalle-documento-almacen/detalle-documento-almacen.component';

const appRoutes: Routes = [
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'productos', component: ProductosComponent},
  {path: 'series', component: HistorialSerieComponent},
  {path: 'movimientos', component: HistorialMovimientosComponent},
  {path: 'movimientos/:id', component: DetalleDocumentoAlmacenComponent},
  {path: 'stock', component: StockComponent},
  {path: 'stock/ingresoproductos', component: IngresoProductosComponent},
  {path: 'stock/salidaproductos', component: SalidaProductosComponent},
  {path: 'salidavendedores', component: ListadoSalidaVendedoresComponent},
  {path: 'salidavendedores/ingreso', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/retorno', component: RetornoVendedoresComponent},
  {path: 'retornovendedores', component: RetornoVendedoresComponent},
  {path: 'comisiones', component: ComisionesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'ventas', component: VentasListarComponent},
  {path: 'ventas/nueva', component: VentasComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'direcciones', component: DireccionesComponent},
  {path: 'ventas/nueva/:id', component: VentasComponent},
  {path : 'detalleproductos', component: DetalleProductosComponent}
];

export const appRoutingProvider: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);


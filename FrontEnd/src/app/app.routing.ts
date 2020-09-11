import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { ProductosComponent } from './components/detalleproductos/productos/productos.component';
import { StockComponent } from './components/stock/stock.component';
import { IngresoProductosComponent } from './components/ingreso-productos/ingreso-productos.component';
import { SalidaProductosComponent } from './components/salida-productos/salida-productos.component';
import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { ClientesComponent } from './modulo-clientes/clientes/clientes.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { DireccionesComponent } from './components/direcciones/direcciones.component';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { HistorialSerieComponent } from './components/historial-serie/historial-serie.component';
import { HistorialMovimientosComponent } from './components/historial-movimientos/historial-movimientos.component';
import { DetalleProductosComponent } from './components/detalleproductos/detalleproductos.component';
import { DetalleDocumentoAlmacenComponent } from './components/detalle-documento-almacen/detalle-documento-almacen.component';
import { ReglasEvaluacionComponent } from './components/tablas-maestras/reglas-evaluacion/reglas-evaluacion.component';
import { RetornoVendedoresCierreComponent } from './components/retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { VentasSalidaComponent } from './components/ventas-salida/ventas-salida.component';
import { CreditosListarComponent } from './components/creditos-listar/creditos-listar.component';
import { CreditosListarAfiliacionesComponent } from './components/creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { CobranzasListarComponent } from './components/cobranzas-listar/cobranzas-listar.component';
import { CobranzaArchivosComponent } from './components/cobranza-archivos/cobranza-archivos.component';
import { CobranzaArchivosPagoComponent } from './components/cobranza-archivos-pago/cobranza-archivos-pago.component';
import { CobranzaArchivosDetalleComponent } from './components/cobranza-archivos-detalle/cobranza-archivos-detalle.component';
import { CobranzaArchivosListarComponent } from './components/cobranza-archivos-listar/cobranza-archivos-listar.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';
import { VendedoresComponent } from './components/vendedores/vendedores.component';
import { TalonariosComponent } from './components/talonarios/talonarios.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { SeguimientosComponent } from './modulo-clientes/seguimientos/seguimientos.component';
import { PlantillasComponent } from './components/plantillas/plantillas.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { CobranzaDirectaComponent } from './components/cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './components/cobranza-directa-listar/cobranza-directa-listar.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { CobranzaClienteListarComponent } from './components/cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaJudicialListarComponent } from './components/cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './components/cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialGenerarComponent } from './components/cobranza-judicial-generar/cobranza-judicial-generar.component';
import { ProcesoJudicialVinculadosComponent } from './components/proceso-judicial-vinculados/proceso-judicial-vinculados.component';
import { CobranzaJudicialMultipleComponent } from './components/cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CobranzaClienteListarMorososComponent } from './components/cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';
import { CobranzaManualComponent } from './components/cobranza-manual/cobranza-manual.component';
import { CobranzaManualListarComponent } from './components/cobranza-manual-listar/cobranza-manual-listar.component';
import { CooperativaDireccionesComponent } from './components/plantillas/cooperativa-direcciones/cooperativa-direcciones.component';
import { AfiliacionesComponent } from './components/afiliaciones/afiliaciones.component';
import { NgModule } from '@angular/core';

export const appRoutes: Routes = [
  {
    path: '' , 
    loadChildren : () =>
      import('./core/core.module').then( m => m.CoreModule ) ,
  } ,

  {
    path: 'clientes' , 
    loadChildren : () =>
      import('./modulo-clientes/modulo-clientes.module').then( m => m.ModuloClientesModule ) ,
  } ,

  {path: 'productos', component: ProductosComponent},
  {path: 'series', component: HistorialSerieComponent},

  {path: 'movimientos', component: HistorialMovimientosComponent},
  {path: 'movimientos/ver/:id', component: DetalleDocumentoAlmacenComponent},
  {path: 'movimientos/editar/:ideditar', component: DetalleDocumentoAlmacenComponent},
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
  {path: 'trabajadores', component: VendedoresComponent},
  {path: 'talonarios', component: TalonariosComponent},
  {path: 'ventas', component: VentasListarComponent},
  {path: 'ventas/nueva', component: VentasComponent},
  {path: 'ventas/nueva/:idcliente', component: VentasComponent},
  {path: 'ventas/nueva/presupuesto/:idpresupuesto', component: VentasComponent},
  {path: 'ventas/nueva/:idventacanje/:idcliente', component: VentasComponent},
  {path: 'ventas/editar/:ideditar', component: VentasComponent},
  {path: 'ventas/:idventa', component: VentasComponent},
  {path: 'ventas/salida/:idventa', component: VentasSalidaComponent},
  {path: 'ventas/salida/editar/:idventaeditar', component: VentasSalidaComponent},
  {path: 'afiliaciones', component: CreditosListarAfiliacionesComponent},
  {path: 'creditos', component: CreditosListarComponent},
  {path: 'creditos/ver/:idcredito', component: CreditosComponent},
  {path: 'creditos/editar/:idcreditoeditar', component: CreditosComponent},
  {path: 'afiliaciones/nueva', component: AfiliacionesComponent},
  {path: 'afiliaciones/ver/:idcredito', component: AfiliacionesComponent},
  {path: 'afiliaciones/editar/:idcreditoeditar', component: AfiliacionesComponent},
  {path: 'creditos/nuevo', component: CreditosComponent},
  {path: 'creditos/nuevo-cliente/:idcliente', component: CreditosComponent},
  {path: 'creditos/nuevo/:idpresupuesto', component: CreditosComponent},
  {path: 'creditos/nuevo/refinanciamiento/:idclienterefinanciado', component: CreditosComponent},
  {path: 'presupuesto', component: PresupuestoComponent},
  {path: 'refinanciamiento', component: RefinanciamientoComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'direcciones', component: DireccionesComponent},
  {path: 'detalleproductos', component: DetalleProductosComponent},
  {path: 'cobranzas', component: CobranzasListarComponent},
  {path: 'cobranzas-cliente', component: CobranzaClienteListarComponent},
  {path: 'cobranzas-cliente-morosos', component: CobranzaClienteListarMorososComponent},
  {path: 'cobranza-directa', component: CobranzaDirectaListarComponent},
  {path: 'cobranza-directa/nueva', component: CobranzaDirectaComponent},
  {path: 'cobranza-directa/ver/:idcobranza', component: CobranzaDirectaComponent},
  {path: 'cobranza-directa/editar/:idcobranzaeditar', component: CobranzaDirectaComponent},
  {path: 'cobranza-archivos', component: CobranzaArchivosListarComponent},
  {path: 'cobranza-archivos/ver/:idcobranza', component: CobranzaArchivosDetalleComponent},
  {path: 'cobranza-archivos/generar', component: CobranzaArchivosComponent},
  {path: 'cobranza-archivos/cobrar/:id', component: CobranzaArchivosPagoComponent},
  {path: 'cobranza-judicial', component: CobranzaJudicialListarComponent},
  {path: 'cobranza-judicial/ver/:idprocesover', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/editar/:idprocesoeditar', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/agregar/:idprocesoagregar', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nuevo-multiple', component: CobranzaJudicialMultipleComponent},
  {path: 'cobranza-judicial/nueva-credito/:idcredito', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/venta/:idventa', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/salida/:idventasalida', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/generar/nuevo/:idprocesonuevo', component: CobranzaJudicialGenerarComponent},
  {path: 'cobranza-judicial/generar/ver/:idprocesover', component: CobranzaJudicialGenerarComponent},
  {path: 'cobranza-manual', component: CobranzaManualListarComponent},
  {path: 'cobranza-manual/ver/:idcobranza', component: CobranzaManualComponent},
  {path: 'instituciones', component: InstitucionesComponent},
  {path: 'trabajadores', component: TrabajadoresComponent},
  {path: 'registro-horas', component: RegistroHorasComponent},
  {path: 'reporte-asistencia', component: ReporteAsistenciaComponent},
  {path: 'proceso-judicial-vinculados', component: ProcesoJudicialVinculadosComponent},
  {path: 'plantillas', component: PlantillasComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'configuracion', component: CooperativaDireccionesComponent},
  {path: 'evaluacion-reglas', component: ReglasEvaluacionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy : PreloadAllModules ,
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

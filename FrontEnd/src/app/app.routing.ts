import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule, RoutesRecognized} from '@angular/router';

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
import { EvaluacionExpressComponent } from './components/evaluacion/evaluacion-express/evaluacion-express.component';
import { EvaluacionComponent } from './components/evaluacion/evaluacion.component';
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
import { ConsultarClienteComponent } from './components/clientes/consultar-cliente/consultar-cliente.component';
import { VendedoresComponent } from './components/vendedores/vendedores.component';
import { TalonariosComponent } from './components/talonarios/talonarios.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { SeguimientosComponent } from './components/seguimientos/seguimientos.component';
import { CourierComponent } from './components/courier/courier.component';
import { PlantillasComponent } from './components/plantillas/plantillas.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { CobranzaDirectaComponent } from './components/cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './components/cobranza-directa-listar/cobranza-directa-listar.component';
import { InstitucionComponent } from './components/instituciones/institucion/institucion.component';
import { SedeComponent } from './components/instituciones/sede/sede.component';
import { SubsedeComponent } from './components/instituciones/subsede/subsede.component';
import { CobranzaClienteListarComponent } from './components/cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaJudicialListarComponent } from './components/cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './components/cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialGenerarComponent } from './components/cobranza-judicial-generar/cobranza-judicial-generar.component';

export const appRoutes: Routes = [
  // {path: '', component: ConsultarClienteComponent}, //prueba
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'productos', component: ProductosComponent},
  {path: 'series', component: HistorialSerieComponent},
  {path: 'evaluacion', component: EvaluacionComponent},
  {path: 'evaluacion-express', component: EvaluacionExpressComponent},
  // {path: 'evaluacion/:idpresupuesto', component: EvaluacionComponent},
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
  {path: 'vendedores', component: VendedoresComponent},
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
  {path: 'creditos/nuevo', component: CreditosComponent},
  {path: 'creditos/nuevo/:idpresupuesto', component: CreditosComponent},
  {path: 'creditos/nuevo/refinanciamiento/:idclienterefinanciado', component: CreditosComponent},
  {path: 'presupuesto', component: PresupuestoComponent},
  {path: 'refinanciamiento', component: RefinanciamientoComponent},
  {path: 'seguimiento', component: SeguimientosComponent},
  {path: 'usuarios', component: UsuariosComponent},
  {path: 'proveedores', component: ProveedoresComponent},
  {path: 'direcciones', component: DireccionesComponent},
  {path: 'detalleproductos', component: DetalleProductosComponent},
  {path: 'evaluacion-reglas', component: ReglasEvaluacionComponent},
  {path: 'cobranzas', component: CobranzasListarComponent},
  {path: 'cobranzas-cliente', component: CobranzaClienteListarComponent},
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
  {path: 'cobranza-judicial/nueva-credito/:idcredito', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/venta/:idventa', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/nueva-venta/salida/:idventasalida', component: CobranzaJudicialComponent},
  {path: 'cobranza-judicial/generar/nuevo/:idprocesonuevo', component: CobranzaJudicialGenerarComponent},
  {path: 'cobranza-judicial/generar/ver/:idprocesover', component: CobranzaJudicialGenerarComponent},
  {path: 'trabajadores', component: TrabajadoresComponent},
  {path: 'registro-horas', component: RegistroHorasComponent},
  {path: 'reporte-asistencia', component: ReporteAsistenciaComponent},
  {path: 'plantillas', component: PlantillasComponent},
  {path: 'prueba', component: IngresoProductosComponent},
];



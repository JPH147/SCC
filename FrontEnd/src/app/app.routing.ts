import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
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
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { RefinanciamientoComponent } from './components/refinanciamiento/refinanciamiento.component';
import { CobranzaDirectaComponent } from './components/cobranza-directa/cobranza-directa.component';
import { CobranzaDirectaListarComponent } from './components/cobranza-directa-listar/cobranza-directa-listar.component';
import { CobranzaClienteListarComponent } from './components/cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaJudicialListarComponent } from './components/cobranza-judicial-listar/cobranza-judicial-listar.component';
import { CobranzaJudicialComponent } from './components/cobranza-judicial/cobranza-judicial.component';
import { CobranzaJudicialGenerarComponent } from './components/cobranza-judicial-generar/cobranza-judicial-generar.component';
import { CobranzaJudicialMultipleComponent } from './components/cobranza-judicial-multiple/cobranza-judicial-multiple.component';
import { CobranzaClienteListarMorososComponent } from './components/cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';
import { CobranzaManualComponent } from './components/cobranza-manual/cobranza-manual.component';
import { CobranzaManualListarComponent } from './components/cobranza-manual-listar/cobranza-manual-listar.component';
import { AfiliacionesComponent } from './components/afiliaciones/afiliaciones.component';
import { NgModule } from '@angular/core';

export const appRoutes: Routes = [
  {
    path: '' , 
    loadChildren : () =>
      import('./modulo-home/modulo-home.module').then( m => m.ModuloHomeModule ) ,
  } ,
  {
    path: 'clientes' , 
    loadChildren : () =>
      import('./modulo-clientes/modulo-clientes.module').then( m => m.ModuloClientesModule ) ,
  } ,
  {
    path: 'inventarios' , 
    loadChildren : () =>
      import('./modulo-inventarios/modulo-inventarios.module').then( m => m.ModuloInventariosModule ) ,
  } ,
  {
    path: 'maestro' , 
    loadChildren : () =>
      import('./modulo-maestro/modulo-maestro.module').then( m => m.ModuloMaestroModule ) ,
  } ,
  

  {path: 'salidavendedores', component: ListadoSalidaVendedoresComponent},
  {path: 'salidavendedores/ver/:idsalida', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/editar/:idsalidaeditar', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/ingreso', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/rendicion/:idsalida', component: RetornoVendedoresComponent},
  {path: 'salidavendedores/retorno/:idsalida', component: RetornoVendedoresCierreComponent},
  {path: 'comisiones', component: ComisionesComponent},
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
  {path: 'trabajadores', component: TrabajadoresComponent},
  {path: 'registro-horas', component: RegistroHorasComponent},
  {path: 'reporte-asistencia', component: ReporteAsistenciaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy : PreloadAllModules ,
  })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

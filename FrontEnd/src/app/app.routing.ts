import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { SalidaVendedoresComponent } from './components/salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './components/retorno-vendedores/retorno-vendedores.component';
import { ComisionesComponent } from './components/comisiones/comisiones.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ListadoSalidaVendedoresComponent } from './components/listado-salida-vendedores/listado-salida-vendedores.component';
import { VentasListarComponent } from './components/ventas-listar/ventas-listar.component';
import { RetornoVendedoresCierreComponent } from './components/retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { VentasSalidaComponent } from './components/ventas-salida/ventas-salida.component';
import { TrabajadoresComponent } from './components/trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './components/registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './components/reporte-asistencia/reporte-asistencia.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
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
  {
    path: 'cobranzas' , 
    loadChildren : () =>
      import('./modulo-cobranzas/modulo-cobranzas.module').then( m => m.ModuloCobranzasModule ) ,
  } ,
  {
    path: 'creditos' , 
    loadChildren : () =>
      import('./modulo-creditos/modulo-creditos.module').then( m => m.ModuloCreditosModule ) ,
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
  {path: 'presupuesto', component: PresupuestoComponent},
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

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

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
  {
    path: 'ventas' , 
    loadChildren : () =>
      import('./modulo-ventas/modulo-ventas.module').then( m => m.ModuloVentasModule ) ,
  } ,
  {
    path: 'asistencia' , 
    loadChildren : () =>
      import('./modulo-asistencia/modulo-asistencia.module').then( m => m.ModuloAsistenciaModule ) ,
  } ,
  {
    path: 'reportes' , 
    loadChildren : () =>
      import('./modulo-reportes/modulo-reportes.module').then( m => m.ModuloReportesModule ) ,
  } ,
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})

export class AppRoutingModule { }

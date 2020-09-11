import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { RegistroHorasComponent } from './registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './reporte-asistencia/reporte-asistencia.component';

const routes: Routes = [
  {path: '', redirectTo: 'reporte-asistencia', pathMatch: 'full'} ,
  {path: 'trabajadores', component: TrabajadoresComponent} ,
  {path: 'registro-horas', component: RegistroHorasComponent} ,
  {path: 'reporte-asistencia', component: ReporteAsistenciaComponent} ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloAsistenciaRoutingModule { }

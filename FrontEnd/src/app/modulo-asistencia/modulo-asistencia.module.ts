import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';

import { ModuloAsistenciaRoutingModule } from './modulo-asistencia-routing.module';

import { RegistroHorasComponent } from './registro-horas/registro-horas.component';
import { ReporteAsistenciaComponent } from './reporte-asistencia/reporte-asistencia.component';
import { TrabajadoresComponent } from './trabajadores/trabajadores.component';
import { VentanaTrabajadoresComponent } from './trabajadores/ventana-trabajador/ventana-trabajador.component';

@NgModule({
  declarations: [
    RegistroHorasComponent ,
    ReporteAsistenciaComponent ,
    TrabajadoresComponent ,
    VentanaTrabajadoresComponent ,
  ],
  imports: [
    ModuloAsistenciaRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    CompartidoModule ,
    MaterialModule ,
  ]
})
export class ModuloAsistenciaModule { }

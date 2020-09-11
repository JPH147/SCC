import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModuloHomeRoutingModule } from './modulo-home-routing.module';

import { ChartistModule } from 'ng-chartist';
import { MaterialModule } from '../material/material.module';

import { InicioComponent } from './inicio/inicio.component' ;
import { LoginComponent } from './login/login.component';
import { ReporteMorosidadComponent } from './inicio/reporte-morosidad/reporte-morosidad.component';

@NgModule({
  declarations: [
    InicioComponent ,
    LoginComponent ,
    ReporteMorosidadComponent ,
  ],
  imports: [
    ModuloHomeRoutingModule ,
    CommonModule ,
    RouterModule ,
    FormsModule ,
    ReactiveFormsModule ,
    ChartistModule ,
    MaterialModule ,
  ]
})
export class ModuloHomeModule { }

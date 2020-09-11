import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InicioComponent  } from './componentes/inicio/inicio.component' ;
import { LoginComponent } from './componentes/login/login.component';
import { MenuComponent } from './componentes/menu/menu.component';
import { MaterialModule } from '../material/material.module';
import { ReporteMorosidadComponent } from './componentes/inicio/reporte-morosidad/reporte-morosidad.component';
import { ChartistModule } from 'ng-chartist';

import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  declarations: [
    InicioComponent ,
    LoginComponent ,
    MenuComponent ,
    ReporteMorosidadComponent
  ],
  imports: [
    CoreRoutingModule ,
    CommonModule ,
    RouterModule ,
    FormsModule ,
    ReactiveFormsModule ,
    MaterialModule ,
    ChartistModule ,
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }

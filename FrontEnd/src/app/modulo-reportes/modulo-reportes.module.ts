import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';

import { ModuloReportesRoutingModule } from './modulo-reportes-routing.module';

import { CobranzaClienteListarComponent } from './cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaClienteListarMorososComponent } from './cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';

@NgModule({
  declarations: [
    CobranzaClienteListarComponent ,
    CobranzaClienteListarMorososComponent ,
  ],
  imports: [
    ModuloReportesRoutingModule ,
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    CompartidoModule ,
    MaterialModule
  ]
})
export class ModuloReportesModule { }

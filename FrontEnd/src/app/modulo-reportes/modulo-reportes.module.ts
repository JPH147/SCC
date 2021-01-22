import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';

import { ModuloReportesRoutingModule } from './modulo-reportes-routing.module';

import { CobranzaClienteListarComponent } from './cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaClienteListarMorososComponent } from './cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';
import { RegistroUsuariosComponent } from './registro-usuarios/registro-usuarios.component';
import { VentanaAuxiliarProvisionalComponent } from './ventana-auxiliar-provisional/ventana-auxiliar-provisional.component';

@NgModule({
  declarations: [
    CobranzaClienteListarComponent ,
    CobranzaClienteListarMorososComponent,
    RegistroUsuariosComponent ,
    VentanaAuxiliarProvisionalComponent ,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CompartidoModule } from '../compartido/compartido.module';
import { MaterialModule } from '../material/material.module';
import { ImageUploadModule } from 'angular2-image-upload';

import { ModuloCreditosRoutingModule } from './modulo-creditos-routing.module';

import { AfiliacionesComponent } from './afiliaciones/afiliaciones.component';
import { CreditosComponent } from './creditos/creditos.component';
import { CreditosListarComponent } from './creditos-listar/creditos-listar.component';
import { CreditosListarAfiliacionesComponent } from './creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { RefinanciamientoComponent } from './refinanciamiento/refinanciamiento.component';

@NgModule({
  declarations: [
    AfiliacionesComponent ,
    CreditosComponent ,
    CreditosListarComponent ,
    CreditosListarAfiliacionesComponent ,
    RefinanciamientoComponent ,
  ],
  imports: [
    ModuloCreditosRoutingModule ,
    CommonModule,
    FormsModule ,
    ReactiveFormsModule ,
    RouterModule ,
    CompartidoModule ,
    MaterialModule ,
    ImageUploadModule ,
  ]
})
export class ModuloCreditosModule { }

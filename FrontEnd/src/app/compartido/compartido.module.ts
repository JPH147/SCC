import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { ReducersGlobales } from './reducers/estados';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import { VentanaConfirmarComponent } from './componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaGenerarPagoTransaccionComponent } from './componentes/ventana-generar-pago-transaccion/ventana-generar-pago-transaccion.component';
import { SeleccionarClienteComponent } from './componentes/seleccionar-cliente/seleccionar-cliente.component';

@NgModule({
  declarations: [
    VentanaConfirmarComponent ,
    VentanaGenerarPagoTransaccionComponent ,
    SeleccionarClienteComponent,
  ],
  imports: [
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    MaterialModule ,
    StoreModule.forRoot(ReducersGlobales) ,
  ]
})
export class CompartidoModule { }

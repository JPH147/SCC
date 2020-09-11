import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { ReducersGlobales } from './reducers/estados';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';

import { VentanaConfirmarComponent } from './componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaGenerarPagoTransaccionComponent } from './componentes/ventana-generar-pago-transaccion/ventana-generar-pago-transaccion.component';
import { SeleccionarClienteComponent } from './componentes/seleccionar-cliente/seleccionar-cliente.component';
import { VentanaEditarCuentaComponent } from './componentes/ventana-editar-cuenta/ventana-editar-cuenta.component';
import { VentanaEditarDireccionComponent } from './componentes/ventana-editar-direccion/ventana-editar-direccion.component';
import { VentanaEmergenteClientes } from './componentes/ventana-emergente/ventanaemergente';
import { VentanaEditarTelefonoComponent } from './componentes/ventana-editar-telefono/ventana-editar-telefono.component';
import { VentanaVentasComponent } from './componentes/ventana-ventas/ventana-ventas.component';
import { VentanaEmergenteContacto } from './componentes/ventana-emergentecontacto/ventanaemergentecontacto';
import { VentanaFotoComponent } from './componentes/ventana-foto/ventana-foto.component';

@NgModule({
  declarations: [
    VentanaConfirmarComponent ,
    VentanaGenerarPagoTransaccionComponent ,
    SeleccionarClienteComponent ,
    VentanaEditarCuentaComponent ,
    VentanaEditarDireccionComponent ,
    VentanaEmergenteClientes ,
    VentanaEditarTelefonoComponent ,
    VentanaVentasComponent ,
    VentanaEmergenteContacto ,
    VentanaFotoComponent ,
  ],
  imports: [
    CommonModule ,
    FormsModule ,
    ReactiveFormsModule ,
    MaterialModule ,
  ]
})
export class CompartidoModule { }

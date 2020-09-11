import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoSalidaVendedoresComponent } from './listado-salida-vendedores/listado-salida-vendedores.component';
import { SalidaVendedoresComponent } from './salida-vendedores/salida-vendedores.component';
import { RetornoVendedoresComponent } from './retorno-vendedores/retorno-vendedores.component';
import { RetornoVendedoresCierreComponent } from './retorno-vendedores-cierre/retorno-vendedores-cierre.component';
import { ComisionesComponent } from './comisiones/comisiones.component';
import { VentasListarComponent } from './ventas-listar/ventas-listar.component';
import { VentasComponent } from './ventas/ventas.component';
import { VentasSalidaComponent } from './ventas-salida/ventas-salida.component';

const routes: Routes = [
  {path: '', redirectTo: 'ventas', pathMatch: 'full'} ,
  {path: 'salidavendedores', component: ListadoSalidaVendedoresComponent},
  {path: 'salidavendedores/ver/:idsalida', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/editar/:idsalidaeditar', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/ingreso', component: SalidaVendedoresComponent},
  {path: 'salidavendedores/rendicion/:idsalida', component: RetornoVendedoresComponent},
  {path: 'salidavendedores/retorno/:idsalida', component: RetornoVendedoresCierreComponent},
  {path: 'comisiones', component: ComisionesComponent},
  {path: 'ventas', component: VentasListarComponent},
  {path: 'ventas/nueva', component: VentasComponent},
  {path: 'ventas/nueva/:idcliente', component: VentasComponent},
  {path: 'ventas/nueva/presupuesto/:idpresupuesto', component: VentasComponent},
  {path: 'ventas/nueva/:idventacanje/:idcliente', component: VentasComponent},
  {path: 'ventas/editar/:ideditar', component: VentasComponent},
  {path: 'ventas/:idventa', component: VentasComponent},
  {path: 'ventas/salida/:idventa', component: VentasSalidaComponent},
  {path: 'ventas/salida/editar/:idventaeditar', component: VentasSalidaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloVentasRoutingModule { }

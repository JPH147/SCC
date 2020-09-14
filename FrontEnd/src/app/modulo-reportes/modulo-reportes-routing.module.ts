import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobranzaClienteListarComponent } from './cobranza-cliente-listar/cobranza-cliente-listar.component';
import { CobranzaClienteListarMorososComponent } from './cobranza-cliente-listar-morosos/cobranza-cliente-listar-morosos.component';

const routes: Routes = [
  {path: 'listado-cliente', component: CobranzaClienteListarComponent},
  {path: 'listado-cliente-morosos', component: CobranzaClienteListarMorososComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloReportesRoutingModule { }

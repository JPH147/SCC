import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditosListarAfiliacionesComponent } from './creditos-listar-afiliaciones/creditos-listar-afiliaciones.component';
import { CreditosListarComponent } from './creditos-listar/creditos-listar.component';
import { CreditosComponent } from './creditos/creditos.component';
import { AfiliacionesComponent } from './afiliaciones/afiliaciones.component';
import { RefinanciamientoComponent } from './refinanciamiento/refinanciamiento.component';

const routes: Routes = [
  {path: '', redirectTo: 'creditos', pathMatch: 'full'} ,
  {path: 'afiliaciones', component: CreditosListarAfiliacionesComponent},
  {path: 'creditos', component: CreditosListarComponent},
  {path: 'creditos/ver/:idcredito', component: CreditosComponent},
  {path: 'creditos/editar/:idcreditoeditar', component: CreditosComponent},
  {path: 'afiliaciones/nueva', component: AfiliacionesComponent},
  {path: 'afiliaciones/ver/:idcredito', component: AfiliacionesComponent},
  {path: 'afiliaciones/editar/:idcreditoeditar', component: AfiliacionesComponent},
  {path: 'creditos/nuevo', component: CreditosComponent},
  {path: 'creditos/nuevo-cliente/:idcliente', component: CreditosComponent},
  {path: 'creditos/nuevo/:idpresupuesto', component: CreditosComponent},
  {path: 'creditos/nuevo/refinanciamiento/:idclienterefinanciado', component: CreditosComponent},
  {path: 'refinanciamiento', component: RefinanciamientoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloCreditosRoutingModule { }

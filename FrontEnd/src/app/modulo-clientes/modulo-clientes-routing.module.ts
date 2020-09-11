import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionComponent } from './evaluacion/evaluacion.component';
import { EvaluacionExpressComponent } from './evaluacion/evaluacion-express/evaluacion-express.component';
import { SeguimientosComponent } from './seguimientos/seguimientos.component';
import { ClientesComponent } from './clientes/clientes.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'evaluacion', component: EvaluacionComponent },
  { path: 'evaluacion-express', component: EvaluacionExpressComponent },
  { path: 'seguimiento', component: SeguimientosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModuloClientesRoutingModule { }

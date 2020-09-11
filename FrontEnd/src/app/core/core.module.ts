import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MenuComponent } from './componentes/menu/menu.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    MenuComponent ,
  ],
  imports: [
    CommonModule ,
    RouterModule ,
    FormsModule ,
    ReactiveFormsModule ,
    MaterialModule ,
  ],
  exports: [
    MenuComponent
  ]
})
export class CoreModule { }

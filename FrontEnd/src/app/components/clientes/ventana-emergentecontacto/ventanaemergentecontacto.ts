import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray , FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosTelefonos} from '../../global/telefonos';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-ventanaemergentecontacto',
  templateUrl: './ventanaemergentecontacto.html',
  styleUrls: ['./ventanaemergentecontacto.css'],
  providers: [ServiciosTelefonos]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteContacto {
  public TelefonosForm: FormGroup;
  public Tipos: TipoTelefono[];
  public Relevancias: RelevanciaTelefono[];
  public contador: number;
  public ListTelefonos: any;
  public items: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteContacto>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private ServicioTelefono: ServiciosTelefonos,
  ) {
    this.contador = 1;
  }

  onNoClick(): void {
    this.ventana.close();
  }
/*
  add() {
    this.items.push(this.createItem());
    console.log(this.items);
  }*/

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.TelefonosForm = this.FormBuilder.group({
      items : this.FormBuilder.array([this.createItem(1)])
  });
  this.ListarTipos();
  this.ListarRelevancia();
}
createItem(value): FormGroup {
  return this.FormBuilder.group({
    telefono: [null,[
      Validators.required,
      Validators.pattern('[0-9- ]+')
    ]],
    tipo: [{value:2,disabled:false},[

    ]] ,
    relevancia: [{value:value,disabled:true},[

    ]],
    observacion: [null,[
      Validators.required
    ]]
  });
}

  add(): void {
    //this.items = this.TelefonosForm.get('items') as FormArray;
 //   this.items.push(this.createItem());
    this.items = this.TelefonosForm.get('items') as FormArray;
    this.items.push(this.createItem(2))
  }
 
 /* Para eliminar items */
  /*
  EliminarItem(index){
    this.items.removeAt(index);
  }*/

  ListarTipos() {
      this.Tipos = [
        {id: 1, viewValue: 'Celular'},
        {id: 2, viewValue: 'Casa'},
        {id: 3, viewValue: 'Trabajo'},
        {id: 4, viewValue: 'Otro'}];
  }
  ListarRelevancia() {
      this.Relevancias = [
        {id: 1, viewValue: 'Principal'},
        {id: 2, viewValue: 'Secundario'},
        {id: 0, viewValue: 'Inactivo'},
      ];
    }

  Guardar(formulario) {
    console.log(formulario.get('items').value);
    /*
    if (this.data !== 0) {
      console.log(this.data);
      this.ServicioTelefono.CrearTelefono(this.data, formulario.value.telefono ,
        formulario.value.observacion, formulario.value.tipo,
        formulario.value.relevancia).subscribe(res => console.log(res));
    }
      this.ventana.close();
      */
  }

}

export interface TipoTelefono {
  id: number;
  viewValue: string;
}

export interface RelevanciaTelefono {
  id: number;
  viewValue: string;
}

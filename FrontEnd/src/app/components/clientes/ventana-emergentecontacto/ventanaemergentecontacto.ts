import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {ServiciosTelefonos} from '../../global/telefonos';
import { NgControl } from '@angular/forms';

@Component({
  selector: 'app-ventanaemergentecontacto',
  templateUrl: './ventanaemergentecontacto.html',
  styleUrls: ['./ventanaemergentecontacto.css'],
  providers:[ServiciosTelefonos]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteContacto {
  public TelefonosForm: FormGroup;
  public Tipos: TipoTelefono[];
  public Relevancias: RelevanciaTelefono[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteContacto>,
    private FormBuilder: FormBuilder,
    private ServicioTelefono: ServiciosTelefonos,
    
  ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {
    this.TelefonosForm = this.FormBuilder.group({
      'telefono': [null,[
        Validators.required
      ]],
      'tipo': [null,[
        Validators.required
      ]],
      'relevancia': [null, [
        Validators.required
      ]],
      'observacion': [null, [
        Validators.required
      ]]
  });
  this.ListarTipos();
  this.ListarRelevancia();
  
}
  ListarTipos()
    {
      this.Tipos = [
        {id: 1, viewValue: 'Celular'},
        {id: 2, viewValue: 'Casa'},
        {id: 3, viewValue: 'Trabajo'},
        {id: 4, viewValue: 'Otro'}];
    }
    ListarRelevancia()
    {
      this.Relevancias = [
        {id: 0, viewValue: 'Inactivo'},
        {id: 1, viewValue: 'Principal'},
        {id: 2, viewValue: 'Secundario'}
      ];
    }

  Guardar(formulario) {
    if (this.data!=0) {
      console.log(this.data);
      this.ServicioTelefono.CrearTelefono(this.data,formulario.value.telefono , 
        formulario.value.observacion, formulario.value.tipo,
        formulario.value.relevancia).subscribe(res => console.log(res));
    }
      this.ventana.close();
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

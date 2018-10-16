import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ProveedorService } from '../proveedores.service';
import { ServiciosGenerales } from '../../global/servicios';


@Component({
  selector: 'app-ventana-emergente',
  templateUrl: './ventana-emergente.component.html',
  styleUrls: ['./ventana-emergente.component.css'],
  providers:[ProveedorService, ServiciosGenerales]
})

export class VentanaEmergenteProveedores {
  public selectedValue: string;
  public ProveedoresForm: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProveedores>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProveedorServicios: ProveedorService,

  ) { }

  ngOnInit() {
    /* Crear formulario */
    this.ProveedoresForm = this.FormBuilder.group({
      'tipodocumento': [null, [
        Validators.required
      ]],
      'documento': [null, [
        Validators.required
      ]],
      'nombre': [null, [
        Validators.required
      ]],
      'representante': [null, [
        Validators.required
      ]],
      'observacion': [null, [
        Validators.required
      ]],
     
    });



    if (this.data) {
      console.log(this.data);
      this.ProveedoresForm.get('tipodocumento').setValue(this.data.objeto.institucion);
      //this.ListarSede(this.data.objeto.institucion);
      this.ProveedoresForm.get('documento').setValue(this.data.objeto.sede);
      //this.ListarSubsede(this.data.objeto.sede);
      this.ProveedoresForm.get('nombre').setValue(this.data.objeto.subsede);
      this.ProveedoresForm.get('representante').setValue(this.data.objeto.codigo);
      this.ProveedoresForm.get('observacion').setValue(this.data.objeto.dni);
     
      // this.ProveedoresForm.get('fecharegistro').setValue(this.data.fecharegistro);
      //this.ProveedoresForm.controls['sede'].enable();
      //this.ProveedoresForm.controls['subsede'].enable();
    }


  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ProveedorService } from '../proveedores.service';
import { ServiciosGenerales } from '../../global/servicios';
import { TipoDocumento } from '../../global/tipodocumento';


@Component({
  selector: 'app-ventana-emergente',
  templateUrl: './ventana-emergente.component.html',
  styleUrls: ['./ventana-emergente.component.css'],
  providers:[ProveedorService, ServiciosGenerales]
})

export class VentanaEmergenteProveedores {
  public selectedValue: string;
  public ProveedoresForm: FormGroup;
  public TipoDocumento: any;
  public Documento: any[];
  public Nombre: any[];
  public tipo_documento: string;
  public identificador_nombre: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteProveedores>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    private ProveedoresServicios: ProveedorService,

  ) { }

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit() {
    /* Crear formulario */
    this.ProveedoresForm = this.FormBuilder.group({
      'tipodocumento': [null, [
        Validators.required
      ]],
      'documento': [null, [
        Validators.required,
        Validators.pattern('[0-9- ]+')
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

    this.Servicios.ListarTipoDocumento().subscribe( res => {
      this.TipoDocumento=res
/*      console.log(res)
      for (let i in res) {
        this.TipoDocumento.push(res[i]);
      }*/
    });


    if (this.data) {
      
      this.ProveedoresForm.get('tipodocumento').setValue(this.data.objeto.tipo_documento);
      //this.ListarSede(this.data.objeto.institucion);
      this.ProveedoresForm.get('documento').setValue(this.data.objeto.documento);
      //this.ListarSubsede(this.data.objeto.sede);
      this.ProveedoresForm.get('nombre').setValue(this.data.objeto.nombre);
      this.ProveedoresForm.get('representante').setValue(this.data.objeto.representante);
      this.ProveedoresForm.get('observacion').setValue(this.data.objeto.observacion);
     
      // this.ProveedoresForm.get('fecharegistro').setValue(this.data.fecharegistro);
      //this.ProveedoresForm.controls['sede'].enable();
      //this.ProveedoresForm.controls['subsede'].enable();
    }

    this.tipo_documento="Documento";
    this.identificador_nombre="Nombre"

  }

  ListarTipoDocumento() {
    this.Servicios.ListarTipoDocumento().subscribe( res => {
      this.TipoDocumento = [];
      // tslint:disable-next-line:forin
      for (let i in res) {
        this.TipoDocumento.push ( res[i] );
      }
   });

  }

  DocumentoSeleccionado(event) {
    if (event.value==1) {
      this.tipo_documento="DNI";
      this.identificador_nombre="Nombre"
    }
    if (event.value==2) {
      this.tipo_documento="RUC";
      this.identificador_nombre="Razón social"
    }

  }


  Guardar(formulario) {
    //console.log(formulario.value.subsede);
    if (this.data) {
      // tslint:disable-next-line:max-line-length
      this.ProveedoresServicios.Actualizar(this.data.id, formulario.value.tipodocumento, formulario.value.documento,
        formulario.value.nombre, formulario.value.representante, formulario.value.observacion,
      ).subscribe(res => console.log(res));

      this.ProveedoresForm.reset();
      this.ventana.close();
    }

    if (!this.data) {
      this.ProveedoresServicios.Agregar(formulario.value.tipodocumento, formulario.value.documento, formulario.value.nombre,
         formulario.value.representante, formulario.value.observacion).subscribe(res => console.log(res));
    }
      this.ProveedoresForm.reset();
      this.ventana.close();
  }



}

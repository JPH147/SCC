import {Component, Inject, OnInit, AfterViewInit} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';

@Component({
  selector: 'app-ventanaemergentemarca',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteMarca {

  public selectedValue: string;
  public MarcaForm: FormGroup;
  public Tipo: Array<any>;
  public lsttipos: any[] = [];
  public mensaje: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteMarca>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.MarcaForm = this.FormBuilder.group({
      'nombre': [null, [
        Validators.required
      ]],
      'idtipo': [null, [
        Validators.required
      ]]
    });

    this.Servicios.ListarTipoProductos('', '').subscribe(res=>{
      // tslint:disable-next-line:prefer-const
      let tipos = res;
      // tslint:disable-next-line:forin
      for (let i in tipos) {
        this.lsttipos.push(tipos[i]);
      }
    });

    if (this.data) {
      this.MarcaForm.get('nombre').setValue(this.data.marca);
      this.MarcaForm.get('idtipo').setValue(this.data.idtipo);
    }
  }

  Guardar(formulario) {
    if (this.data) {
      this.mensaje = 'Datos actualizados satisfactoriamente';
      this.Servicios.EditarMarca(this.data.id, formulario.value.idtipo, formulario.value.nombre).subscribe();
    }

    if (!this.data) {
      this.mensaje = 'Marca creada satisfactoriamente';
      this.Servicios.CrearMarca(formulario.value.idtipo, formulario.value.nombre).subscribe();
    }
      this.MarcaForm.reset();
      this.ventana.close();
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

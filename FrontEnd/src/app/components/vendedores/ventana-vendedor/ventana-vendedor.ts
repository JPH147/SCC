import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosVentas } from '../../global/ventas';
import {merge,fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-ventana-vendedor',
  templateUrl: './ventana-vendedor.html',
  styleUrls: ['./ventana-vendedor.css'],
  providers: [ServiciosVentas]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaVendedorComponent {

  public VendedoresForm : FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaVendedorComponent>,
    private Builder: FormBuilder,
    private Servicios: ServiciosVentas,
    ) {}

  ngOnInit() {
    this.CrearFormulario();

    if(this.data){
      this.AsignarValores();
    }

  }

  ngAfterViewInit(){
  }

  CrearFormulario(){
    this.VendedoresForm = this.Builder.group({
      'id': [null, [
      ]],
      'documento': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'email': ["", [
        Validators.required,
      ]],
      'comision': [10, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
    });
  }

  AsignarValores(){
    this.VendedoresForm.get('id').setValue(this.data.vendedor.id)
    this.VendedoresForm.get('documento').setValue(this.data.vendedor.dni)
    this.VendedoresForm.get('nombre').setValue(this.data.vendedor.nombre)
    this.VendedoresForm.get('email').setValue(this.data.vendedor.email)
    this.VendedoresForm.get('comision').setValue(this.data.vendedor.comision)
  }

  Guardar(){
    if( !this.data ){
      this.CrearVendedor()
    } else {
      this.ActualizarVendedor()
    }
  }

  CrearVendedor(){
    this.Servicios.CrearVendedor(
      this.VendedoresForm.value.documento,
      this.VendedoresForm.value.nombre,
      this.VendedoresForm.value.email,
      this.VendedoresForm.value.comision
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

  ActualizarVendedor(){
    this.Servicios.ActualizarVendedor(
      this.VendedoresForm.value.id,
      this.VendedoresForm.value.documento,
      this.VendedoresForm.value.nombre,
      this.VendedoresForm.value.email,
      this.VendedoresForm.value.comision
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

}

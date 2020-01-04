import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosVentas } from '../../global/ventas';
import {merge,fromEvent} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-ventana-vendedores-cargo',
  templateUrl: './ventana-vendedores-cargo.component.html',
  styleUrls: ['./ventana-vendedores-cargo.component.css'],
  providers : [ ServiciosVentas ]
})
export class VentanaVendedoresCargoComponent implements OnInit {

  public VendedoresForm : FormGroup;
  public Cargos : Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaVendedoresCargoComponent>,
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
      'nombre': [{value: "", disabled: false}, [
        Validators.required
      ]],
    });
  }

  AsignarValores(){
    this.VendedoresForm.get('id').setValue(this.data.vendedor.id)
    this.VendedoresForm.get('nombre').setValue(this.data.vendedor.nombre)
  }

  Guardar(){
    if( !this.data ){
      this.CrearVendedorCargo()
    } else {
      this.ActualizarVendedorCargo()
    }
  }

  CrearVendedorCargo(){
    this.Servicios.CrearVendedorCargo(
      this.VendedoresForm.value.nombre,
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

  ActualizarVendedorCargo(){
    this.Servicios.ActualizarVendedorCargo(
      this.VendedoresForm.value.id,
      this.VendedoresForm.value.nombre,
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

}

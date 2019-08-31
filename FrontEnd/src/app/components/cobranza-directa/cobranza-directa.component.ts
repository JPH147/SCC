import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material' ;
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { SeleccionarClienteComponent } from '../retorno-vendedores/seleccionar-cliente/seleccionar-cliente.component';

@Component({
  selector: 'app-cobranza-directa',
  templateUrl: './cobranza-directa.component.html',
  styleUrls: ['./cobranza-directa.component.scss']
})
export class CobranzaDirectaComponent implements OnInit {

  public CobranzaDirectaForm : FormGroup ;
  public cuentas : Array<any> ;

  constructor(
    private Builder : FormBuilder ,
    private Dialogo : MatDialog ,
    private Servicio : CobranzasService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.ListarCuentas();
  }

  CrearFormulario(){
    this.CobranzaDirectaForm = this.Builder.group({
      id_cliente: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      cliente: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      fecha: [ { value : new Date() , disabled : false } , [
        Validators.required
      ] ],
      cuenta_bancaria: [ { value : 1 , disabled : false } , [
        Validators.required
      ] ],
      numero_operacion: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      monto: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
      observaciones: [ { value : null , disabled : false } , [
        Validators.required
      ] ],
    })
  }

  ListarCuentas(){
    this.Servicio.ListarCuentas().subscribe(res=>{
      this.cuentas = res['data'].cuentas;
    })
  }

  SeleccionarCliente(){
    let Ventana = this.Dialogo.open(SeleccionarClienteComponent,{
      width: "1200px"
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        console.log(res)
        this.CobranzaDirectaForm.get('id_cliente').setValue(res.id);
        this.CobranzaDirectaForm.get('cliente').setValue(res.nombre);
      }
    })
  }
  RemoverCliente(){
    this.CobranzaDirectaForm.get('id_cliente').setValue(null);
    this.CobranzaDirectaForm.get('cliente').setValue(null);
  }

}

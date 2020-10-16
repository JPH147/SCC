import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { BancosService } from 'src/app/modulo-maestro/bancos/bancos.service';

@Component({
  selector: 'app-ventana-bancos',
  templateUrl: './ventana-bancos.component.html',
  styleUrls: ['./ventana-bancos.component.css']
})
export class VentanaBancosComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  public BancosForm : FormGroup ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaBancosComponent> ,
    private _builder : FormBuilder ,
    private _bancos : BancosService
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;

    if( this.data ) {
      this.BancosForm.get('id_banco').setValue(this.data.id) ;
      this.BancosForm.get('banco').setValue(this.data.nombre) ;
    }
  }

  CrearFormulario(){
    this.BancosForm = this._builder.group({
      id_banco : [{ value: null, disabled : false }, [
      ]] ,
      banco: [null,[
        Validators.required
      ]],
    })
  }
  

  Guardar(){
    this.Cargando.next(true) ;

    if ( this.data ) {
      this._bancos.ActualizarBanco(
        this.BancosForm.get('id_banco').value ,
        this.BancosForm.get('banco').value ,
      ).subscribe(res=>{
        this.Cargando.next(false) ;
        this.ventana.close(res) ;
      }) ;
    } else {
      this._bancos.CrearBanco(
        this.BancosForm.get('banco').value ,
      ).subscribe(res=>{
        this.Cargando.next(false) ;
        this.ventana.close(res) ;
      }) ;
    }
  }
}

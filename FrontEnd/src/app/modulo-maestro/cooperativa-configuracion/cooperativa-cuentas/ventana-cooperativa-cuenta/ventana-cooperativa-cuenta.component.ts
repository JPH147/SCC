import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CooperativaConfiguracionService } from '../../cooperativa-configuracion.service';
import { BehaviorSubject } from 'rxjs';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { BancosService } from 'src/app/modulo-maestro/bancos/bancos.service';

@Component({
  selector: 'app-ventana-cooperativa-cuenta',
  templateUrl: './ventana-cooperativa-cuenta.component.html',
  styleUrls: ['./ventana-cooperativa-cuenta.component.css']
})
export class VentanaCooperativaCuentaComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  public CuentasForm : FormGroup ;
  public Bancos: Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaCooperativaCuentaComponent> ,
    private _builder : FormBuilder ,
    private _cooperativa : CooperativaConfiguracionService ,
    private _bancos : BancosService
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListarBancos() ;

    if( this.data ) {
      this.CuentasForm.get('id_cuenta').setValue(this.data.id) ;
      this.CuentasForm.get('banco').setValue(this.data.id_banco) ;
      this.CuentasForm.get('titular').setValue(this.data.titular) ;
      this.CuentasForm.get('numero_cuenta').setValue(this.data.numero_cuenta) ;
      this.CuentasForm.get('cci').setValue(this.data.cci) ;
      this.CuentasForm.get('alias').setValue(this.data.alias) ;
    }
  }

  ListarBancos() {
    this._bancos.ListarBancos("",1,50).subscribe(res=>{
      this.Bancos=res['data'].bancos ;
    })
  }

  CrearFormulario(){
    this.CuentasForm = this._builder.group({
      id_cuenta : [{ value: null, disabled : false }, [
      ]] ,
      banco: [null,[
        Validators.required
      ]],
      titular: ["",[
        Validators.required
      ]],
      numero_cuenta: ["",[
        Validators.required
      ]],
      cci: ["",[
        Validators.required
      ]],
      alias: ["",[
        Validators.required
      ]],
    })
  }
  

  Guardar(){
    this.Cargando.next(true) ;

    if ( this.data ) {
      this._cooperativa.ActualizarCuenta(
        this.CuentasForm.get('id_cuenta').value ,
        this.CuentasForm.get('banco').value ,
        this.CuentasForm.get('titular').value ,
        this.CuentasForm.get('numero_cuenta').value ,
        this.CuentasForm.get('cci').value ,
        this.CuentasForm.get('alias').value ,
      ).subscribe(res=>{
        this.Cargando.next(false) ;
        this.ventana.close(res) ;
      }) ;
    } else {
      this._cooperativa.CrearCuenta(
        this.CuentasForm.get('banco').value ,
        this.CuentasForm.get('titular').value ,
        this.CuentasForm.get('numero_cuenta').value ,
        this.CuentasForm.get('cci').value ,
        this.CuentasForm.get('alias').value ,
      ).subscribe(res=>{
        this.Cargando.next(false) ;
        this.ventana.close(res) ;
      }) ;
    }
  }
}

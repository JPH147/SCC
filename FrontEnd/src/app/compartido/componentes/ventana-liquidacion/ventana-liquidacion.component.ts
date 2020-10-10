import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CobranzasService } from 'src/app/modulo-cobranzas/cobranzas-listar/cobranzas.service';
import { usuario } from '../../modelos/login.modelos';
import { EstadosGlobales } from '../../reducers/estados';

@Component({
  selector: 'app-ventana-liquidacion',
  templateUrl: './ventana-liquidacion.component.html',
  styleUrls: ['./ventana-liquidacion.component.css']
})
export class VentanaLiquidacionComponent implements OnInit {

  private subscripcionUsuario : Subscription ;
  private Usuario : usuario ;

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public LiquidacionForm : FormGroup ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private _cobranzas : CobranzasService ,
    private _builder : FormBuilder ,
    private ventana : MatDialogRef<VentanaLiquidacionComponent> ,
    private _store : Store<EstadosGlobales>
  ) { }

  ngOnInit(): void {
    this.subscripcionUsuario = this._store.select('usuario').subscribe(usuario => {
      this.Usuario = usuario ;
    })

    this.CrearFormulario() ;
  }

  ngOnDestroy() {
    this.subscripcionUsuario.unsubscribe() ;
  }

  CrearFormulario() {
    this.LiquidacionForm = this._builder.group({
      monto : [ { value : 0, disabled : false } ,[
        Validators.required
      ]] ,
      observacion : [ { value : "", disabled : false } ,[
        Validators.required
      ]]
    })
  }

  LiquidarTransaccion() {
    this.Cargando.next(true) ;

    this._cobranzas.CrearLiquidacionTransaccion(
      this.data.tipo ,
      this.data.id_transaccion ,
      new Date() ,
      this.LiquidacionForm.get('monto').value ,
      this.Usuario.id ,
      this.LiquidacionForm.get('observacion').value ,
    )
    .pipe(
      finalize(() => {
        this.Cargando.next(false) ;
      })
    )
    .subscribe(resultado => {
      if ( resultado ) {
        this.ventana.close(true) ;
      } else {
        this.ventana.close(false) ;
      }
    })
  }

}

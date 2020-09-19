import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CooperativaConfiguracionService } from 'src/app/modulo-maestro/cooperativa-configuracion/cooperativa-configuracion.service';

@Component({
  selector: 'app-ventana-cambiar-orden',
  templateUrl: './ventana-cambiar-orden.component.html',
  styleUrls: ['./ventana-cambiar-orden.component.css']
})
export class VentanaCambiarOrdenComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public NumeroOrdenForm : FormGroup ;
  public PosiblesNumeroOrden : Array<number> = [1,2,3,4] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data : any ,
    private ventana : MatDialogRef<VentanaCambiarOrdenComponent> ,
    private _builder : FormBuilder ,
    private _configuracion : CooperativaConfiguracionService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;
  }

  private CrearFormulario() {
    this.NumeroOrdenForm = this._builder.group({
      numero_orden : [ { value : this.data.numero_orden, disabled : false }, [
        Validators.required
      ]]
    })
  }

  public Guardar() {
    this.Cargando.next(true) ;

    this._configuracion.ActualizarDireccionOrden(
      this.data.id_direccion ,
      this.data.numero_orden ,
      this.NumeroOrdenForm.get('numero_orden').value
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe( resultado =>{
      this.ventana.close(resultado) ;
    })
  }

}

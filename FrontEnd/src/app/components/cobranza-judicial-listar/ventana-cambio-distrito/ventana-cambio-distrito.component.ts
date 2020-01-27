import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ProcesoJudicialVinculadosService } from '../../proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';

@Component({
  selector: 'app-ventana-cambio-distrito',
  templateUrl: './ventana-cambio-distrito.component.html',
  styleUrls: ['./ventana-cambio-distrito.component.css']
})
export class VentanaCambioDistritoComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public TrasladoJudicialForm : FormGroup ;
  public Distritos : Array<any> ;
  public Instancias : Array<any> ;
  public mismo_distrito : boolean = false ;
  public proceso_anterior : any ;
  public proceso_igual : boolean ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    private ventana : MatDialogRef<VentanaCambioDistritoComponent> ,
    private Builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
    private _vinculados : ProcesoJudicialVinculadosService ,
  ) { }

  ngOnInit() {
    this.ListarDistritosJudiciales() ;
    this.CrearFormulario();
    this.VerificarAnterior();
    this.AsignarValores();
  }

  CrearFormulario(){
    this.TrasladoJudicialForm = this.Builder.group({
      distrito_judicial : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      instancia_judicial : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      juez : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      especialista : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      expediente : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      sumilla : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
    })
  }

  AsignarValores(){
    this.TrasladoJudicialForm.get('sumilla').setValue(this.data.sumilla) ;
  }

  VerificarAnterior(){
    this._judiciales.ListarAnteriorxId(this.data.id).subscribe(res=>{
      console.log(res) ;
      this.proceso_anterior = res ;
    })
  }

  ListarDistritosJudiciales(){
    this._vinculados.ListarDistritosJudiciales("",1,50).subscribe(res=>{
      this.Distritos = res['data'].distritos
    })
  }

  DistritoJudicialSeleccionado(){
    this.ListarInstanciasJudiciales();
    this.mismo_distrito = ( this.TrasladoJudicialForm.value.distrito_judicial == this.data.id_distrito ) ;

    this.VerificarDevolucionADistritoAnterior() ;
  }

  VerificarDevolucionADistritoAnterior(){
    if( this.proceso_anterior ) {
      if( this.TrasladoJudicialForm.value.distrito_judicial == this.proceso_anterior.id_juzgado_distrito ) {
        this.proceso_igual = true ;
        this.TrasladoJudicialForm.get('instancia_judicial').setValue(this.proceso_anterior.id_juzgado_instancia) ;
        this.TrasladoJudicialForm.get('juez').setValue(this.proceso_anterior.juez) ;
        this.TrasladoJudicialForm.get('especialista').setValue(this.proceso_anterior.especialista) ;
        this.TrasladoJudicialForm.get('expediente').setValue(this.proceso_anterior.expediente) ;
        this.TrasladoJudicialForm.get('sumilla').setValue(this.proceso_anterior.sumilla) ;
      } else {
        this.proceso_igual = false ;
        this.TrasladoJudicialForm.get('instancia_judicial').setValue(null) ;
        this.TrasladoJudicialForm.get('juez').setValue("") ;
        this.TrasladoJudicialForm.get('especialista').setValue("") ;
        this.TrasladoJudicialForm.get('expediente').setValue("") ;
        this.TrasladoJudicialForm.get('sumilla').setValue("") ;
      }
    }
  }

  ListarInstanciasJudiciales(){
    this._vinculados.ListarInstanciasJudiciales(this.TrasladoJudicialForm.value.distrito_judicial,"","",1,50).subscribe(res=>{
      this.Instancias = res['data'].instancias
    })
  }

  Guardar(){
    if( this.proceso_igual ) {
      this._judiciales.ActualizarProcesoTraslado(
        this.proceso_anterior.id ,
        this.data.id
      ).subscribe(res=>{
        this.ventana.close(res) ;
      })
    } else {
      this._judiciales.CrearProcesoJudicialTraslado(
        this.data.id ,
        this.TrasladoJudicialForm.value.expediente ,
        this.TrasladoJudicialForm.value.instancia_judicial ,
        this.TrasladoJudicialForm.value.juez ,
        this.TrasladoJudicialForm.value.especialista ,
        this.TrasladoJudicialForm.value.sumilla
      ).subscribe(res=>{
        this.ventana.close(res) ;
      })
    }
  }

}

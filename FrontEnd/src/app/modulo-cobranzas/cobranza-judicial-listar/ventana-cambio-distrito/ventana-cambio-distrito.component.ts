import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ProcesoJudicialVinculadosService } from '../../../modulo-maestro/proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { BehaviorSubject } from 'rxjs';
import { CobranzaJudicialService } from '../../cobranza-judicial/cobranza-judicial.service';
import { finalize } from 'rxjs/operators';

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
  public Jueces : Array<any>;
  public Especialistas : Array<any>;
  public mismo_distrito : boolean = false ;
  public misma_instancia : boolean = false ;
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
      id_juez : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      juez : [ { value : null, disabled : false },[
        Validators.required
      ] ] ,
      id_especialista : [ { value : null, disabled : false },[
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
    // this.VerificarDevolucionADistritoAnterior() ;

    if( this.TrasladoJudicialForm.value.distrito_judicial == this.data.id_distrito ) {
      this.TrasladoJudicialForm.get('expediente').setValue(this.data.expediente) ;
      // this.mismo_distrito = true ;
    } else {
      this.TrasladoJudicialForm.get('expediente').setValue("") ;
      // this.mismo_distrito = false ;
    }
  }

  InstanciaJudicialSeleccionada(){
    this.misma_instancia = ( this.TrasladoJudicialForm.value.instancia_judicial == this.data.id_instancia ) ;

    this.TrasladoJudicialForm.get('id_juez').setValue(null) ;
    this.TrasladoJudicialForm.get('juez').setValue("") ;
    this.TrasladoJudicialForm.get('id_especialista').setValue(null) ;
    this.TrasladoJudicialForm.get('especialista').setValue("") ;
    this.ListarJueces() ;
    this.ListarEspecialistas() ;
  }

  // VerificarDevolucionADistritoAnterior(){
  //   if( this.proceso_anterior ) {
  //     if( this.TrasladoJudicialForm.value.distrito_judicial == this.proceso_anterior.id_juzgado_distrito ) {
  //       this.proceso_igual = true ;
  //       this.TrasladoJudicialForm.get('instancia_judicial').setValue(this.proceso_anterior.id_juzgado_instancia) ;
  //       this.ListarJueces() ;
  //       this.ListarEspecialistas() ;
  //       // this.TrasladoJudicialForm.get('juez').setValue(this.proceso_anterior.juez) ;
  //       // this.TrasladoJudicialForm.get('especialista').setValue(this.proceso_anterior.especialista) ;
  //       this.TrasladoJudicialForm.get('expediente').setValue(this.proceso_anterior.expediente) ;
  //       this.TrasladoJudicialForm.get('sumilla').setValue(this.proceso_anterior.sumilla) ;
  //     } else {
  //       this.proceso_igual = false ;
  //       this.TrasladoJudicialForm.get('instancia_judicial').setValue(null) ;
  //       this.TrasladoJudicialForm.get('juez').setValue("") ;
  //       this.TrasladoJudicialForm.get('especialista').setValue("") ;
  //       this.TrasladoJudicialForm.get('expediente').setValue("") ;
  //       this.TrasladoJudicialForm.get('sumilla').setValue("") ;
  //     }
  //   }
  // }

  ListarInstanciasJudiciales(){
    this._vinculados.ListarInstanciasJudiciales(this.TrasladoJudicialForm.value.distrito_judicial,"","",1,50).subscribe(res=>{
      this.Instancias = res['data'].instancias
    })
  }

  ListarJueces(){
    this._vinculados.ListarJuez(this.TrasladoJudicialForm.value.instancia_judicial,"","","juez",this.TrasladoJudicialForm.value.juez,1,50).subscribe(res=>{
      this.Jueces = res['data'].jueces
    })
  }

  ListarEspecialistas(){
    this._vinculados.ListarJuez(this.TrasladoJudicialForm.value.instancia_judicial,"","","especialista",this.TrasladoJudicialForm.value.especialista,1,50).subscribe(res=>{
      this.Especialistas = res['data'].jueces
    })
  }

  JuezSeleccionado(event){
    this.TrasladoJudicialForm.get('id_juez').setValue(event.option.value.id_juzgado_juez);
    this.TrasladoJudicialForm.get('juez').setValue(event.option.value.juzgado_juez);
  }

  EspecialistaSeleccionado(event){
    this.TrasladoJudicialForm.get('id_especialista').setValue(event.option.value.id_juzgado_juez);
    this.TrasladoJudicialForm.get('especialista').setValue(event.option.value.juzgado_juez);
  }

  RemoverJuez(){
    this.TrasladoJudicialForm.get('id_juez').setValue(null);
    this.TrasladoJudicialForm.get('juez').setValue("");
  }

  RemoverEspecialista(){
    this.TrasladoJudicialForm.get('id_especialista').setValue(null);
    this.TrasladoJudicialForm.get('especialista').setValue("");
  }

  Guardar(){
    const proceso_igual = this.TrasladoJudicialForm.value.expediente.trim() === this.data.expediente.trim() ;

    this.Cargando.next(true) ;

    if( proceso_igual ) {
      this._judiciales.ActualizarProcesoTraslado(
        this.proceso_anterior.id ,
        this.data.id
      )
      .pipe(
        finalize(() => {
          this.Cargando.next(false) ;
        })
      )
      .subscribe(res=>{
        this.ventana.close(res) ;
      })
    } else {
      this._judiciales.CrearProcesoJudicialTraslado(
        this.data.id ,
        this.TrasladoJudicialForm.value.expediente ,
        this.TrasladoJudicialForm.value.instancia_judicial ,
        this.TrasladoJudicialForm.value.id_juez ,
        this.TrasladoJudicialForm.value.id_especialista ,
        this.TrasladoJudicialForm.value.sumilla
      )
      .pipe(
        finalize(() => {
          this.Cargando.next(false) ;
        })
      )
      .subscribe(res=>{
        this.ventana.close(res) ;
      })
    }
  }

}

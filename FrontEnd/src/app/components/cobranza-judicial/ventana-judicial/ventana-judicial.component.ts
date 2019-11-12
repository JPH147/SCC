import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CobranzaJudicialService } from '../cobranza-judicial.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-judicial',
  templateUrl: './ventana-judicial.component.html',
  styleUrls: ['./ventana-judicial.component.css']
})
export class VentanaJudicialComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public archivo : File ;
  public archivo_nombre : string = "";
  public VentanaJudicialForm : FormGroup ;
  public TipoDocumentos : Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private ventana : MatDialogRef<VentanaJudicialComponent> ,
    private Builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.EstablecerTipoDocumento();

    if(this.data.proceso_detalle){
      this.EditarProceso();
    }
  }

  CrearFormulario(){
    this.VentanaJudicialForm = this.Builder.group({
      id_proceso : [ { value: null, disabled : false },[
      ] ],
      tipo_documento : [ { value: null, disabled : false },[
        Validators.required ,
      ] ],
      fecha : [ { value: new Date(), disabled : false }, [
        Validators.required ,
      ] ],
      numero_resolucion : [ { value: "", disabled : false }, [
        Validators.required ,
        Validators.min(1)
      ] ],
      sumilla : [ { value: "", disabled : false }, [
        Validators.required ,
      ] ],
      // archivo : [ { value: "", disabled : false }, [
      // ] ],
      comentarios : [ { value: "", disabled : false }, [
        Validators.required ,
      ] ],
    })
  }

  EditarProceso(){
    this.VentanaJudicialForm.get('id_proceso').setValue(this.data.proceso_detalle.id) ;
    this.VentanaJudicialForm.get('tipo_documento').setValue(this.data.proceso_detalle.tipo_documento) ;
    this.VentanaJudicialForm.get('fecha').setValue(this.data.proceso_detalle.fecha) ;
    this.VentanaJudicialForm.get('numero_resolucion').setValue(this.data.proceso_detalle.numero) ;
    this.VentanaJudicialForm.get('sumilla').setValue(this.data.proceso_detalle.sumilla) ;
    this.VentanaJudicialForm.get('comentarios').setValue(this.data.proceso_detalle.comentarios) ;
    this.archivo_nombre = this.data.proceso_detalle.archivo ;
  }

  SubirArchivo(archivo: FileList) {
    this.archivo = archivo.item(0);
    this.archivo_nombre = this.archivo.name ;
    // this.VentanaJudicialForm.get('archivo').setValue(true);
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = null ;
    // this.VentanaJudicialForm.get('archivo').setValue(null);
  }

  EstablecerTipoDocumento(){
    this.TipoDocumentos=[
      "Escrito" , "Resolución", "Oficio"
    ]
  }

  Guardar(){
    this.Cargando.next(true);
    if( this.data.proceso ) {
      this._judiciales.CrearProcesoDetalle(
        this.data.proceso,
        this.VentanaJudicialForm.value.tipo_documento,
        this.VentanaJudicialForm.value.fecha,
        this.VentanaJudicialForm.value.numero_resolucion,
        this.VentanaJudicialForm.value.sumilla,
        this.archivo_nombre,
        this.VentanaJudicialForm.value.comentarios
      )
      .pipe(
        finalize(()=>this.Cargando.next(false))
      )
      .subscribe(res=>{
        this.ventana.close( { resultado: res } );
      })
    }

    if( this.data.proceso_detalle ) {
      this._judiciales.ActualizarProcesoDetalle(
        this.VentanaJudicialForm.value.id_proceso,
        this.VentanaJudicialForm.value.tipo_documento,
        this.VentanaJudicialForm.value.fecha,
        this.VentanaJudicialForm.value.numero_resolucion,
        this.VentanaJudicialForm.value.sumilla,
        this.archivo_nombre,
        this.VentanaJudicialForm.value.comentarios
      )
      .pipe(
        finalize(()=>this.Cargando.next(false))
      )
      .subscribe(res=>{
        this.ventana.close( { resultado: res } );
      })
    }
  }

}

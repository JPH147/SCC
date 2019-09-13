import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { PlantillasService } from '../plantillas/plantillas.service';
import { finalize } from 'rxjs/operators';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-cobranza-archivos-pago',
  templateUrl: './cobranza-archivos-pago.component.html',
  styleUrls: ['./cobranza-archivos-pago.component.scss']
})
export class CobranzaArchivosPagoComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public PagosPlanillaForm : FormGroup ;

  public archivo : File ;
  public archivo_nombre : string ;
  public es_txt : boolean ;
  public enviado : boolean = false ;
  public Descuentos : Array<any> = [] ;

  constructor(
    private location : Location ,
    private Builder : FormBuilder ,
    private Servicio : CobranzasService ,
    private PServicio : PlantillasService ,
  ) { }

  ngOnInit() {
    this.CrearFormulario();
  }

  Atras(){
    this.location.back()
  }

  CrearFormulario(){
    this.PagosPlanillaForm = this.Builder.group({
      numero_descuentos : [ { value : null , disabled : false } ,[
      ] ] ,
      total_descuentos : [ { value : null , disabled : false } ,[
      ] ] ,
      total_no_descuentos : [ { value : null , disabled : false } ,[
      ] ] ,
    })
  }

  ArchivoSeleccionado(evento){
    if ( evento.target.files.length>0 ) {
      if ( evento.target.files[0].type == "text/plain" ) {
        this.archivo = evento.target.files[0] ;
        this.archivo_nombre = this.archivo.name ;
        this.es_txt = true ;
      } else {
        this.es_txt = false ;
      }
    } else {
      this.archivo = null ;
      this.archivo_nombre = "" ;
    }
  }

  RemoverArchivo(){
    this.archivo = null ;
    this.archivo_nombre = "" ;
    this.es_txt = null ;
  }

  SubirArchivo(){

    this.enviado = true ;
    this.Cargando.next(true) ;

    let nombre = "pago_" + new Date().getTime();

    this.PServicio.SubirArchivo(this.archivo).subscribe(res=>{
      this.Servicio.MoverArchivoPNP(res['data'], nombre)
      .pipe( finalize( () => {
        this.enviado = false ;
        this.Cargando.next(false) ;
      }) )
      .subscribe( resultado => {
        if (resultado['codigo']==0) {
          this.PagosPlanillaForm.get('numero_descuentos').setValue( resultado['mensaje'].total_procesado ) ;
          this.PagosPlanillaForm.get('total_descuentos').setValue( resultado['mensaje'].total_descontado ) ;
          this.PagosPlanillaForm.get('total_no_descuentos').setValue( resultado['mensaje'].total_Ndescontado ) ;
          this.Descuentos = resultado['data'] ;
          this.VerificarPagos();
        } else {
          // this.ventana.close(false);
        }
      });
    })
  }

  VerificarPagos(){
    this.Descuentos.forEach((item)=>{
      item.completado = false ;
      if( item.cliente ) {
        this.Servicio.ListarCobranzasRealizadasxPlanilla(item.cliente.id,item.descuento)
        .pipe( finalize(()=>{item.completado = true }) )
        .subscribe(res=>{
          item.realizados = res.cuotas
        });
      }
    })
  }

}

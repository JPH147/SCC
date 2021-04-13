import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { URLIMAGENES } from 'src/app/core/servicios/url';
import { CobranzaJudicialService } from '../cobranza-judicial.service';

@Component({
  selector: 'app-ventana-notificaciones-detalle',
  templateUrl: './ventana-notificaciones-detalle.component.html',
  styleUrls: ['./ventana-notificaciones-detalle.component.css']
})
export class VentanaNotificacionesDetalleComponent implements OnInit {
  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  public enalace_archivo : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaNotificacionesDetalleComponent> ,
    private _builder : FormBuilder ,
    private _judiciales : CobranzaJudicialService ,
  ) { }

  ngOnInit(): void {
    this.enalace_archivo = URLIMAGENES.carpeta + 'proceso judicial/' + this.data.archivo ;

    this.data.juzgado_fecha_resolucion == "0000-00-00" ? this.data.juzgado_fecha_resolucion = null : null ;
    this.data.juzgado_fecha_notificacion == "0000-00-00" ? this.data.juzgado_fecha_notificacion = null : null ;
    this.data.juzgado_fecha_envio == "0000-00-00" ? this.data.juzgado_fecha_envio = null : null ;
    this.data.juzgado_fecha_recepcion == "0000-00-00" ? this.data.juzgado_fecha_recepcion = null : null ;
    this.data.central_fecha_notificacion == "0000-00-00" ? this.data.central_fecha_notificacion = null : null ;
    this.data.central_fecha_cargo == "0000-00-00" ? this.data.central_fecha_cargo = null : null ;
  }

  DiasHastaHoy(fecha) : number {
    if ( fecha && this.data.juzgado_fecha_resolucion) {
      let fecha_comparar = moment(this.data.juzgado_fecha_resolucion).toDate() ;
      return moment(fecha).diff(fecha_comparar, 'days') ;
    } else {
      return 0 ;
    }
  }

  AbrirDocumento(archivo){
    if(archivo){
      window.open(archivo, "_blank");
    }
  }
}
  
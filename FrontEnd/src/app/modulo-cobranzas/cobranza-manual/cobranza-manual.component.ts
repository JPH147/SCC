import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { merge, fromEvent, BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, catchError, finalize } from 'rxjs/operators';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cobranza-manual',
  templateUrl: './cobranza-manual.component.html',
  styleUrls: ['./cobranza-manual.component.scss']
})
export class CobranzaManualComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;

  public CobranzaForm : FormGroup ;
  public id_cobranza : number ;
  public Detalle : Array<any> ;

  constructor(
    private route : ActivatedRoute ,
    private location : Location ,
    private _builder : FormBuilder ,
    private _cobranzas : CobranzasService ,
  ) { }

  ngOnInit(): void {
    this.CrearFormulario() ;
    this.route.params.subscribe(params=>{
      if(Object.keys(params).length>0){
        if( params['idcobranza'] ){
          this.id_cobranza = params['idcobranza'];
          this.VerCobranza();
        }
      }
    })
  }

  CrearFormulario(){
    this.CobranzaForm = this._builder.group({
      id : null ,
      id_cliente : null ,
      cliente : null ,
      id_tipo : null ,
      tipo : null ,
      fecha : null ,
      comprobante : null ,
      id_vendedor : null ,
      vendedor : null ,
      monto : null ,
      observaciones : null ,
    })
  }
  
  VerCobranza() {
    this.Cargando.next(true) ;
    this._cobranzas.SeleccionarCobranzaManual(
      this.id_cobranza
    )
    .pipe(
      finalize(()=>{
        this.Cargando.next(false) ;
      })
    )
    .subscribe(res=>{
      this.CobranzaForm.get('id').setValue(res.id) ;
      this.CobranzaForm.get('id_cliente').setValue(res.id_cliente) ;
      this.CobranzaForm.get('cliente').setValue(res.cliente) ;
      this.CobranzaForm.get('id_tipo').setValue(res.id_tipo) ;
      this.CobranzaForm.get('tipo').setValue(res.tipo) ;
      this.CobranzaForm.get('fecha').setValue(res.fecha) ;
      this.CobranzaForm.get('comprobante').setValue(res.comprobante) ;
      this.CobranzaForm.get('id_vendedor').setValue(res.id_vendedor) ;
      this.CobranzaForm.get('vendedor').setValue(res.vendedor) ;
      this.CobranzaForm.get('monto').setValue(res.total) ;
      this.CobranzaForm.get('observaciones').setValue(res.observaciones) ;
      this.Detalle = res.detalle
    })
  }

  Atras(){
    this.location.back()
  }
}

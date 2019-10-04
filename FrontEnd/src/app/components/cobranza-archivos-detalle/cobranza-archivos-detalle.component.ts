import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-cobranza-archivos-detalle',
  templateUrl: './cobranza-archivos-detalle.component.html',
  styleUrls: ['./cobranza-archivos-detalle.component.scss']
})
export class CobranzaArchivosDetalleComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  public id_cobranza : number ;
  public PlanillasForm : FormGroup ;
  public Detalle : Array<any>;

  constructor(
    private route : ActivatedRoute ,
    private location : Location ,
    private Builder : FormBuilder ,
    private _cobranza : CobranzasService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
    this.route.params.subscribe(params => {
      if(Object.keys(params).length>0){
        this.Cargando.next(true);
        if(params['idcobranza']){
          this.id_cobranza=params['idcobranza'];
          // this.id_cobranza = 1 ;
          this.SeleccionarCobranza();
        }
      }
   });
  }

  SeleccionarCobranza(){
    this._cobranza.SeleccionarCobranzaPlanilla(this.id_cobranza).subscribe(res=>{
      if(res){
        this.Cargando.next(false);
        console.log(res)
        this.PlanillasForm.get("institucion").setValue(res['cabecera'].institucion) ;
        this.PlanillasForm.get("sede").setValue(res['cabecera'].sede) ;
        this.PlanillasForm.get("periodo").setValue(moment(res['cabecera'].fecha_fin).format("MM/YYYY")) ;
        this.PlanillasForm.get("fecha_pago").setValue(moment(res['cabecera'].fecha_pago).format("DD/MM/YYYY")) ;
        this.PlanillasForm.get("id_estado").setValue(res['cabecera'].id_estado) ;
        this.PlanillasForm.get("estado").setValue(res['cabecera'].estado) ;
        this.PlanillasForm.get("cantidad").setValue(res['cabecera'].cantidad) ;
        this.PlanillasForm.get("monto").setValue(res['cabecera'].monto) ;
        this.PlanillasForm.get("monto_pagado").setValue(res['cabecera'].monto_pagado) ;
        this.Detalle = res['detalle'].cobranzas ;
      }
    })
  }

  CrearFormulario(){
    this.PlanillasForm = this.Builder.group({
      institucion : [ { value : "" , disabled : false }, [] ],
      sede : [ { value : "" , disabled : false }, [] ],
      periodo : [ { value : "" , disabled : false }, [] ],
      fecha_pago : [ { value : "" , disabled : false }, [] ],
      id_estado : [ { value : "" , disabled : false }, [] ],
      estado : [ { value : "" , disabled : false }, [] ],
      cantidad : [ { value : "" , disabled : false }, [] ],
      monto : [ { value : "" , disabled : false }, [] ],
      monto_pagado : [ { value : "" , disabled : false }, [] ]
    })
  }

  Atras(){
    this.location.back()
  }

}

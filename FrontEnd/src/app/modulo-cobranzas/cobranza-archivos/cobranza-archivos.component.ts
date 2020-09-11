import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

import {default as _rollupMoment, Moment} from 'moment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

export const formato_mes = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranza-archivos.component.html',
  styleUrls: ['./cobranza-archivos.component.css'],
  providers: [ServiciosGenerales,
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: formato_mes},
  ]
})
export class CobranzaArchivosComponent implements OnInit {

  // public fecha_inicio= new Date(moment().format("YYYY-MM-01"));
  // public fecha_fin= new Date(moment().format("YYYY-MM-") + moment().daysInMonth());

  public fecha_inicio = moment(new Date()).startOf('month').toDate();
  public fecha_fin = moment(new Date()).endOf('month').toDate();

  public CobranzaForm: FormGroup;
  public institucion: number;
  public sede = new BehaviorSubject<any>( { institucion: 0 , sede :0 } );
  public Institucion : Array<any>;
  public Sede: Array<any>;
  public cargando : boolean = false ;

  constructor(
    private location: Location,
    private FormBuilder: FormBuilder,
    private Servicio: CobranzasService,
    private GServicios: ServiciosGenerales,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListarInstitucion() ;
    this.ListarSede() ;
  }

  Atras(){
    this.location.back()
  }

  CrearFormulario(){
    this.CobranzaForm = this.FormBuilder.group({
      institucion: [4, [Validators.required]],
      sede: [3, [Validators.required]],
      fecha_fin: moment(),
    })
  }

  ListarInstitucion(){
    this.GServicios.ListarInstitucion().subscribe(res=>{
      this.Institucion=res;
    })
  }

  ListarSede() {
    this.GServicios.ListarSede( this.CobranzaForm.get('institucion').value, '').subscribe(res => {
      this.Sede = res
  })}

  SedeSeleccionada() {
    // this.EmitirInformacion();
    // console.log(this.CobranzaForm.value)
  }

  EmitirInformacion(){
    this.sede.next({
      institucion : this.CobranzaForm.value.institucion ,
      sede : this.CobranzaForm.value.sede ,
      fecha_inicio : this.fecha_inicio ,
      fecha_fin : this.CobranzaForm.value.fecha_fin 
    })
  }
  
  AnoElegido(ano_normalizado: Moment) {
    let ano_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CobranzaForm.value.fecha_fin ) {
      ano_seleccionado = this.CobranzaForm.value.fecha_fin ;
    } else {
      ano_seleccionado = moment() ;
    }
    ano_seleccionado.year(ano_normalizado.year());
    this.CobranzaForm.get('fecha_fin').setValue(ano_seleccionado);
  }

  MesElegido(mes_normalizado: Moment, datepicker: MatDatepicker<Moment>) {
    let mes_seleccionado : moment.Moment ;
    // Se colocó este 'if' para que cuando el valor inicial de 'fecha_fin' sea null, no haya errores en consola
    if( this.CobranzaForm.value.fecha_fin ) {
      mes_seleccionado = this.CobranzaForm.value.fecha_fin ;
    } else {
      mes_seleccionado = moment() ;
    }
    mes_seleccionado.month(mes_normalizado.month());
    this.CobranzaForm.get('fecha_fin').setValue(moment(mes_seleccionado).endOf('month'));
    datepicker.close();
  }
}

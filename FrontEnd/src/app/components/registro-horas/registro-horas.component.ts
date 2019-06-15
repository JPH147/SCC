import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TrabajadoresService } from '../trabajadores/trabajadores.service';
import { fromEvent } from 'rxjs';
import { tap, distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { Time } from '@angular/common';

@Component({
  selector: 'app-registro-horas',
  templateUrl: './registro-horas.component.html',
  styleUrls: ['./registro-horas.component.css']
})
export class RegistroHorasComponent implements OnInit {

  public fecha : Date;
  public id_trabajador : number;
  public trabajador : string;

  public hora_ingreso : Time;
  public ingreso : Time;
  public hora_salida : Time;
  public salida : Time;

  @ViewChild('InputDocumento') FiltroDocumento : ElementRef;

  constructor(
    private Servicio : TrabajadoresService
  ) { }

  ngOnInit() {

    this.fecha=new Date()

    this.ingreso = {hours: new Date().getHours(), minutes: new Date().getMinutes()};
    this.salida = {hours: new Date().getHours(), minutes: new Date().getMinutes()};

  }

  ngAfterViewInit(){
    fromEvent(this.FiltroDocumento.nativeElement, 'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.BuscarTrabajador()
      })
    ).subscribe()
  }

  BuscarTrabajador(){
    this.Servicio.SeleccionarxDocumento(this.FiltroDocumento.nativeElement.value).subscribe(res=>{
      if(res['data']){
        this.id_trabajador=res['data'].id_trabajador
        this.trabajador=res['data'].nombre
        this.hora_ingreso = res['data'].hora_ingreso;
        this.hora_salida = res['data'].hora_salida;
      }
    })
  } 

  Guardar(){
    this.Servicio.CrearTareo(
      this.id_trabajador,
      this.fecha,
      this.hora_ingreso,
      this.ingreso,
      this.hora_salida,
      this.salida
    ).subscribe(res=>console.log(res))
  }

}
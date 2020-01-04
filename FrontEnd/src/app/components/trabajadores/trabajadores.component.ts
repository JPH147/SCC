import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { TrabajadoresService } from './trabajadores.service';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatDialog } from '@angular/material';
import {VentanaTrabajadoresComponent} from './ventana-trabajador/ventana-trabajador.component';
import {VentanaConfirmarComponent} from '../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit, AfterViewInit {

  public fecha_inicio : Date;
  public fecha_fin : Date;
  public id_trabajador : number;
  public trabajador : string;

  public nuevo_trabajador : boolean;

  @ViewChild('InputDocumento', { static: true }) FiltroDocumento : ElementRef;
  @ViewChild('InputTrabajador', { static: true }) FiltroTrabajador : ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator : MatPaginator;

  public ListadoTrabajadores : Trabajadores;
  public Columnas : Array <string> = [ "numero", "documento", "trabajador", "cargo", "hora_ingreso", "hora_salida", "opciones" ];

  constructor(
    private Servicio : TrabajadoresService,
    private Dialogo : MatDialog,
  ) { }

  ngOnInit() {
    this.fecha_inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.fecha_fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    this.ListadoTrabajadores = new Trabajadores(this.Servicio);
    this.ListadoTrabajadores.CargarInformacion("","", 1, 10);

    this.nuevo_trabajador = false;
  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      fromEvent(this.FiltroTrabajador.nativeElement, 'keyup')
    )
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.CargarData();
        this.paginator.pageIndex=0;
      })
    ).subscribe();

    this.paginator.page
    .pipe(
      tap(()=>{
        this.CargarData()
      })
    ).subscribe()

  }

  NuevoTrabajador(){
    let ventana = this.Dialogo.open(VentanaTrabajadoresComponent,{
      width: '900px',
    })

    ventana.afterClosed().subscribe(res=>{
      if(res){
        this.CargarData()
      }
    })

  }

  CargarData(){
    this.ListadoTrabajadores.CargarInformacion(
      this.FiltroDocumento.nativeElement.value,
      this.FiltroTrabajador.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Eliminar(trabajador) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el trabajador', valor: trabajador.nombre}
    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.Eliminar(trabajador.id).subscribe(res => {
        this.CargarData();
       });
      }
    });
   }

}

export class Trabajadores implements DataSource<any> {

  private InformacionTareo = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: TrabajadoresService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionTareo.asObservable();
  }

  disconnect() {
  this.InformacionTareo.complete();
  this.CargandoInformacion.complete();
  }

  CargarInformacion(
    documento : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.Listar( documento, nombre, 0 , numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionTareo.next(res['data'].trabajadores);
    });
  }

}
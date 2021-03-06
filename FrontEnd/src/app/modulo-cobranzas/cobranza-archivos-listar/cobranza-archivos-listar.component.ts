import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {saveAs} from 'file-saver';
import {VentanaConfirmarComponent} from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import * as moment from 'moment' ;
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';

@Component({
  selector: 'app-cobranza-archivos-listar',
  templateUrl: './cobranza-archivos-listar.component.html',
  styleUrls: ['./cobranza-archivos-listar.component.scss']
})
export class CobranzaArchivosListarComponent implements OnInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoCobranzas: CobranzasDataSource;
  public Columnas: string[] = ['numero', 'fecha_creacion','sede', 'fecha_fin', 'cantidad', 'monto', 'estado', 'opciones'];

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Dialogo : MatDialog ,
    private Servicio : CobranzasService
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.ListadoCobranzas = new CobranzasDataSource(this.Servicio);
    this.ListadoCobranzas.CargarCronograma(1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

  }

  CargarData(){
    this.ListadoCobranzas.CargarCronograma(this.paginator.pageIndex+1, this.paginator.pageSize);
  }

  AbrirArchivo(nombre_archivo){
    this.Servicio.ObtenerArchivo(nombre_archivo).subscribe(res=>{
      saveAs(res, nombre_archivo);
    })
  }
  
  Eliminar(cobranza) {
    let VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la cobranza', valor: cobranza.sede + " " + moment(cobranza.fecha_fin).format("MM-YYYY")}
    });
    
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarCobranzaPlanilla(cobranza.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class CobranzasDataSource implements DataSource<any> {

  private InformacionCobranzas = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: CobranzasService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
  return this.InformacionCobranzas.asObservable();
  }

  disconnect() {
  this.InformacionCobranzas.complete();
  this.CargandoInformacion.complete();
  }

  CargarCronograma(
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCobranzas( numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCobranzas.next(res['data'].cobranzas);
    });
  }

}
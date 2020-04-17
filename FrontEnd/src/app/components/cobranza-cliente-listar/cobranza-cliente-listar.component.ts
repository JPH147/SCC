import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

import { ArchivosService } from '../global/archivos';
import { ServiciosTipoPago } from '../global/tipopago';
import * as moment from 'moment';
import {saveAs} from 'file-saver';
import { VentanaCobranzaClienteComponent } from './ventana-cobranza-cliente/ventana-cobranza-cliente.component';

@Component({
  selector: 'app-cobranza-cliente-listar',
  templateUrl: './cobranza-cliente-listar.component.html',
  styleUrls: ['./cobranza-cliente-listar.component.scss'],
  providers : [ServiciosTipoPago]
})
export class CobranzaClienteListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public ListadoTipoPago: Array<any>;

  public ListadoCobranza: CobranzaDataSource;
  public Columnas: string[] = ['numero', 'cliente_dni', 'cliente', 'tipo_pago', 'monto_pendiente', 'opciones'];

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputSubsede', { static: true }) FiltroSubSede: ElementRef;
  @ViewChild('InputSede', { static: true }) FiltroSede: ElementRef;
  @ViewChild('InputInstitución', { static: true }) FiltroInstitucion: ElementRef;
  @ViewChild('InputTipoPago', { static: true }) FiltroTipo: MatSelect;
  @ViewChild('InputEstado', { static: false }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Dialogo : MatDialog ,
    private AServicio : ArchivosService,
    private Servicio: CobranzasService,
    private ServicioTipoPago: ServiciosTipoPago,
  ) { }

  ngOnInit() {
    this.ListarTipoPago();

    this.fecha_inicio = null
    this.fecha_fin = new Date()

    this.ListadoCobranza = new CobranzaDataSource(this.Servicio);
    this.ListadoCobranza.CargarCronograma( "" , "", "", "", 0, this.fecha_inicio, this.fecha_fin,1, 10 );
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page,
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroSubSede.nativeElement, 'keyup'),
      fromEvent(this.FiltroSede.nativeElement, 'keyup'),
      fromEvent(this.FiltroInstitucion.nativeElement, 'keyup')
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();
  }

  CargarData() {
    this.ListadoCobranza.CargarCronograma(
      this.FiltroCliente.nativeElement.value,
      this.FiltroSubSede.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroTipo.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  ListarTipoPago() {
    this.ServicioTipoPago.ListarTipoPago(1).subscribe( res => {
      this.ListadoTipoPago = res;
    });
  }

  ExportToExcel(){
    let nombre_archivo : string = "reporte_cobranzas_" + new Date().getTime();

    this.Servicio.ListarCobranzasxclienteUnlimited(
      nombre_archivo,
      this.FiltroCliente.nativeElement.value,
      this.FiltroSubSede.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroTipo.value,
      this.fecha_inicio,
      this.fecha_fin,
      1
    ).subscribe(res=>{
      if(res){
        this.AbrirArchivo(nombre_archivo,res);
      }
    })
  }

  AbrirArchivo(nombre_archivo,path){
    this.AServicio.ObtenerArchivo(path).subscribe(res=>{
      saveAs(res, nombre_archivo+'.xlsx');
    })
  }

  VerDetallePagos(id_cliente){
    let Ventana = this.Dialogo.open( VentanaCobranzaClienteComponent,{
      width: '900px' ,
      data: { cliente: id_cliente, fecha_inicio : this.fecha_inicio, fecha_fin: this.fecha_fin }
    } )
  }

}

export class CobranzaDataSource implements DataSource<any> {

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
    cliente : string,
    sede : string,
    subsede : string,
    institucion : string,
    tipo_pago : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCobranzasxcliente( cliente, sede, subsede, institucion, tipo_pago, fecha_inicio, fecha_fin, 1,numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCobranzas.next(res['data'].cobranza);
    });
  }
}

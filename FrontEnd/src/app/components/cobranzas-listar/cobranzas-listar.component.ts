import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CobranzasService } from './cobranzas.service';
import { VentanaTipoReporteComponent } from './ventana-tipo-reporte/ventana-tipo-reporte.component';
import { VentanaPagosComponent } from './ventana-pagos/ventana-pagos.component';

import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { VentanaEditarPagoComponent } from './ventana-editar-pago/ventana-editar-pago.component';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';

@Component({
  selector: 'app-cobranzas-listar',
  templateUrl: './cobranzas-listar.component.html',
  styleUrls: ['./cobranzas-listar.component.scss']
})

export class CobranzasListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;

  public ListadoCobranza: CobranzaDataSource;
  public Columnas: string[] = ['numero', 'tipo', 'codigo', "tipo_pago",'cliente', 'monto_total', 'fecha', 'estado', 'opciones'];

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputSubsede', { static: true }) FiltroSubSede: ElementRef;
  @ViewChild('InputSede', { static: true }) FiltroSede: ElementRef;
  @ViewChild('InputInstitución', { static: true }) FiltroInstitucion: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: MatSelect;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public permiso : Rol ;

  constructor(
    private _store : Store<EstadoSesion> ,
    private Dialogo: MatDialog,
    private Notificacion : Notificaciones ,
    private Servicio: CobranzasService
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

    this.fecha_inicio= new Date()
    this.fecha_fin = new Date((new Date()).valueOf() + 1000*60*60*24*30)

    this.ListadoCobranza = new CobranzaDataSource(this.Servicio);
    this.ListadoCobranza.CargarCronograma( "" , "", "", "", 0, this.fecha_inicio, this.fecha_fin, 1, 1, 10 );
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
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  VerDetallePagos( cronograma ){
    let tipo : number = cronograma.id_tipo==3 ? 2 : 1 ;
    let ventana = this.Dialogo.open(VentanaPagosComponent,{
      width : '900px',
      data: { tipo : tipo , cuota : cronograma.id_cronograma }
    })
  }

  EditarCuota(cobranza){
    let Ventana = this.Dialogo.open(VentanaEditarPagoComponent,{
      width : '900px' ,
      data: { tipo : cobranza.id_tipo, id: cobranza.id_cronograma, fecha_vencimiento: cobranza.fecha_vencimiento, tipo_pago: cobranza.id_tipo_pago }
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res===true){
        this.Notificacion.Snack("Se actualizó al cuota satisfactoriamente","");
        this.CargarData();
      }
      if(res===false){
        this.Notificacion.Snack("Ocurrió un error al actualizar la cuota","")
      }
    })
  }

  ExportToExcel(){
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
    tipo : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    estado : number,
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCronograma( cliente, sede, subsede, institucion, tipo, fecha_inicio, fecha_fin, estado, numero_pagina, total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.InformacionCobranzas.next(res['data'].cronograma);
    });
  }

}

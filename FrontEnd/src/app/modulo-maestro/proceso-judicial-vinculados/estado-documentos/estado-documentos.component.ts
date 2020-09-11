import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaEstadoDocumentosComponent } from './ventana-documentos/ventana-documentos.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-estado-documentos',
  templateUrl: './estado-documentos.component.html',
  styleUrls: ['./estado-documentos.component.css']
})
export class EstadoDocumentosComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListarEstados: EstadoDataSource;
  public Columnas: string[] = ["numero" , "documento" , "nombre" , "opciones"];

  @ViewChild('InputDocumento', { static: true }) FiltroDocumento: ElementRef;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ProcesoJudicialVinculadosService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {
    this.ListarEstados = new EstadoDataSource(this.Servicio);
    this.ListarEstados.CargarInformacion("","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup') ,
      fromEvent(this.FiltroEstado.nativeElement, 'keyup')
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
    this.ListarEstados.CargarInformacion(
      this.FiltroDocumento.nativeElement.value,
      this.FiltroEstado.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(estado){
    let Ventana = this.Dialogo.open( VentanaEstadoDocumentosComponent, {
      width: '900px',
      data: estado
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó el estado satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar el estado","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaEstadoDocumentosComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó el estado satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear el estado","")
        }
      }
    })
  }

  Eliminar(estado){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el estado", valor: estado.nombre }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarEstado(estado.id).subscribe(res=>{
          this.CargarData()
        });
      }
    })

  }

}

export class EstadoDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: ProcesoJudicialVinculadosService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    documento : string ,
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarEstado( 0, documento , nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].estados);
    });
  }

}
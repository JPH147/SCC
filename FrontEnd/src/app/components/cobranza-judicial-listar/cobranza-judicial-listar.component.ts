import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Router } from '@angular/router';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados/proceso-judicial-vinculados.service';
import { VentanaCambioDistritoComponent } from './ventana-cambio-distrito/ventana-cambio-distrito.component';
import { Notificaciones } from '../global/notificacion';

@Component({
  selector: 'app-cobranza-judicial-listar',
  templateUrl: './cobranza-judicial-listar.component.html',
  styleUrls: ['./cobranza-judicial-listar.component.css'],
})

export class CobranzaJudicialListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public TipoDocumentos : Array<any> ;
  public Cuentas : Array<any> = [];
  public Distritos : Array<any> = [];

  public ListadoProcesos: CobranzaDataSource;
  public Columnas: string[] = ['id_tipo_documento', 'fecha_inicio', 'cliente_nombre', 'expediente', 'juzgado', 'vendedor','fecha_ultimo_documento','fecha_ultimo_documento_diferencia', 'opciones'];

  @ViewChild('InputExpediente', { static: true }) FiltroExpediente: ElementRef;
  @ViewChild('InputDistrito', { static: true }) FiltroDistrito: ElementRef;
  @ViewChild('InputJuzgado', { static: true }) FiltroJuzgado: ElementRef;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef;
  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputEstado', { static: true }) FiltroEstado: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router : Router ,
    private Dialogo : MatDialog ,
    private Notificaciones : Notificaciones ,
    private _judicial: CobranzaJudicialService,
    private _vinculados : ProcesoJudicialVinculadosService
  ) { }

  ngOnInit() {
    this.ListarTipoDocumentos();
    this.EncontrarFecha();
    this.ListarDistritos();
    this.fecha_inicio = new Date() ;
    this.fecha_fin = new Date() ;

    this.ListadoProcesos = new CobranzaDataSource(this._judicial);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page,
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(this.FiltroDistrito.nativeElement, 'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.ListarDistritos();
      })
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroExpediente.nativeElement, 'keyup'),
      fromEvent(this.FiltroDistrito.nativeElement, 'keyup'),
      fromEvent(this.FiltroJuzgado.nativeElement, 'keyup'),
      fromEvent(this.FiltroDNI.nativeElement, 'keyup'),
      this.sort.sortChange
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

  EncontrarFecha(){
    this._judicial.ObtenerFechaAntigua().subscribe(res=>{
      this.fecha_inicio = res ;
      this.ListadoProcesos.CargarCobranzas("","","","","",this.fecha_inicio,this.fecha_fin,-1,1,10,"fecha_inicio desc");
    })
  }

  CargarData() {
    this.ListadoProcesos.CargarCobranzas(
      this.FiltroExpediente.nativeElement.value,
      this.FiltroDistrito.nativeElement.value,
      this.FiltroJuzgado.nativeElement.value,
      this.FiltroDNI.nativeElement.value,
      this.FiltroCliente.nativeElement.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.FiltroEstado.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active+" "+this.sort.direction
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  CambiarSede( proceso ){
    let Dialogo = this.Dialogo.open(VentanaCambioDistritoComponent,{
      data: proceso ,
      width: '1200px'
    }) ;

    Dialogo.afterClosed().subscribe(res=>{
      if(res){
        this.Notificaciones.Snack("Se creó el traslado satisfactoriamente.","")
        this.CargarData();
      }
      if(res===false) {
        this.Notificaciones.Snack("Ocurrió un error al crear el traslado.","")
      }
    })
  }

  ListarDistritos(){
    this._vinculados.ListarDistritosJudicialesActivos(
      this.FiltroDistrito.nativeElement.value || ""
    ).subscribe(res=>{
      this.Distritos = res ;
    })
  }

  EliminarProceso(proceso){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el proceso", valor: proceso.expediente }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this._judicial.EliminarProcesoCabecera(proceso.id).subscribe((res)=>{
          this.CargarData();
        });
      }
    })
  }

  EjecutarCobranza(proceso){
    this.router.navigate(['/cobranza-judicial','generar','nuevo', proceso.id] )
  }

  AgregarDocumentos(proceso){
    this.router.navigate(['/cobranza-judicial', 'agregar', proceso.id] )
  }

  ListarTipoDocumentos(){
    this._vinculados.ListarDocumentosJudiciales("",1,20).subscribe(res=>{
      this.TipoDocumentos = res['data'].documentos ;
    })
  }

}

export class CobranzaDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _judicial: CobranzaJudicialService,
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInstancias(
    expediente:string,
    distrito:string,
    juzgado:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
  ) {

  }

  CargarCobranzas(
    expediente:string,
    distrito:string,
    juzgado:string,
    dni:string,
    nombre:string,
    fecha_inicio:Date,
    fecha_fin:Date,
    estado:number,
    numero_pagina:number,
    total_pagina:number,
    orden : string
  ) {
    this.CargandoInformacion.next(true);

    this._judicial.Listar( expediente , distrito , juzgado , dni , nombre , fecha_inicio , fecha_fin , estado , numero_pagina , total_pagina, orden )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].procesos);
    });
  }

}
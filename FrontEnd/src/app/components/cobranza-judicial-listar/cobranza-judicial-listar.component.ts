import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSelect, MatPaginator, MatSort, MatDialog } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzaJudicialService } from '../cobranza-judicial/cobranza-judicial.service';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cobranza-judicial-listar',
  templateUrl: './cobranza-judicial-listar.component.html',
  styleUrls: ['./cobranza-judicial-listar.component.css']
})
export class CobranzaJudicialListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoProcesos: CobranzaDataSource;
  public Columnas: string[] = ['id_tipo_documento', 'fecha_inicio', 'cliente_nombre', 'expediente', 'juzgado', 'total', 'opciones'];

  @ViewChild('InputCliente') FiltroCliente: ElementRef;
  @ViewChild('InputExpediente') FiltroExpediente: ElementRef;
  @ViewChild('InputJuzgado') FiltroJuzgado: ElementRef;
  @ViewChild('InputDNI') FiltroDNI: ElementRef;
  @ViewChild('InputEstado') FiltroEstado: MatSelect;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router : Router ,
    private Dialogo : MatDialog ,
    private _judicial: CobranzaJudicialService,
  ) { }

  ngOnInit() {

    this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*60)
    this.fecha_fin=new Date()

    this.ListadoProcesos = new CobranzaDataSource(this._judicial);
    this.ListadoProcesos.CargarCobranzas("","","","",this.fecha_inicio,this.fecha_fin,0,1,10,"fecha_inicio desc");
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page,
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroExpediente.nativeElement, 'keyup'),
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

  CargarData() {
    this.ListadoProcesos.CargarCobranzas(
      this.FiltroExpediente.nativeElement.value,
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

  CargarCobranzas(
    expediente:string,
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

    this._judicial.Listar( expediente , juzgado , dni , nombre , fecha_inicio , fecha_fin , estado , numero_pagina , total_pagina, orden )
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
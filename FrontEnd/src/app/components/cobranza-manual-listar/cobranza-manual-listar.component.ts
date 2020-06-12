import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { merge, fromEvent, BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, catchError, finalize } from 'rxjs/operators';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-cobranza-manual-listar',
  templateUrl: './cobranza-manual-listar.component.html',
  styleUrls: ['./cobranza-manual-listar.component.css']
})
export class CobranzaManualListarComponent implements OnInit, AfterViewInit {

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef ;
  @ViewChild('InputDNI', { static: true }) FiltroDNI: ElementRef ;
  @ViewChild('InputVendedor', { static: true }) FiltroVendedor: ElementRef ;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoCobranza : CobranzaDataSource;
  public Columnas : string[] ;

  public fecha_inicio: Date ;
  public fecha_fin: Date ;
  public tipo_cobranza : number ;

  public Tipos : Array<any> ;

  constructor(
    private _cobranzas : CobranzasService ,
  ) { }

  ngOnInit(): void {
    this.fecha_inicio = new Date((new Date()).valueOf() - 1000*60*60*24*30) ;
    this.fecha_fin = new Date() ;
    this.tipo_cobranza = 0 ;
    this.Columnas = ['numero', 'tipo','cliente', "vendedor", 'comprobante', 'total', 'fecha', 'opciones'] ;

    this.ListadoCobranza = new CobranzaDataSource(this._cobranzas);
    this.ListadoCobranza.CargarCronograma("","","", 0, this.fecha_inicio, this.fecha_fin, 1, 10) ;
  }

  ngAfterViewInit(){
    merge(
      fromEvent( this.FiltroCliente.nativeElement, 'keyup' ) ,
      fromEvent( this.FiltroDNI.nativeElement, 'keyup' ) ,
      fromEvent( this.FiltroVendedor.nativeElement, 'keyup' ) ,
    ).pipe(
      debounceTime(200) ,
      distinctUntilChanged() ,
      tap(()=>{
        this.CambioFiltro() ;
      })
    ).subscribe()
  }

  CambioFiltro(){
    this.ListadoCobranza.CargarCronograma(
      this.FiltroCliente.nativeElement.value ,
      this.FiltroDNI.nativeElement.value ,
      this.FiltroVendedor.nativeElement.value ,
      this.tipo_cobranza ,
      this.fecha_inicio ,
      this.fecha_fin ,
      this.paginator.pageIndex + 1 ,
      this.paginator.pageSize ,
    )
  }
}

export class CobranzaDataSource implements DataSource<any> {

  private InformacionCobranzas = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _cobranzas: CobranzasService
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
    dni : string,
    vendedor : string,
    tipo : number,
    fecha_inicio : Date,
    fecha_fin : Date,
    numero_pagina : number,
    total_pagina : number,
  ) {
    this.CargandoInformacion.next(true);

    this._cobranzas.ListarCobranzasManuales( 
      cliente, 
      dni, 
      vendedor, 
      tipo, 
      fecha_inicio, 
      fecha_fin, 
      numero_pagina, 
      total_pagina
    )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if(res) {
        this.TotalResultados.next(res['mensaje']);
        this.InformacionCobranzas.next(res['data'].cobranzas);
      } else {
        this.TotalResultados.next(0);
        this.InformacionCobranzas.next([]);
      }
    });
  }

}
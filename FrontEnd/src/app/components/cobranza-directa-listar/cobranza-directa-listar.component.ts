import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSelect, MatPaginator, MatSort, MatDialog } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { VentanaConfirmarComponent } from '../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-cobranza-directa-listar',
  templateUrl: './cobranza-directa-listar.component.html',
  styleUrls: ['./cobranza-directa-listar.component.css']
})

export class CobranzaDirectaListarComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoCobranzas: CobranzaDataSource;
  public Columnas: string[] = ['numero', 'fecha', 'cliente', 'banco', 'numero_operacion', 'monto', 'opciones'];

  @ViewChild('InputCliente', { static: true }) FiltroCliente: ElementRef;
  @ViewChild('InputOperacion', { static: true }) FiltroOperacion: ElementRef;
  @ViewChild('InputBanco', { static: true }) FiltroBanco: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private Servicio: CobranzasService,
    private Dialogo : MatDialog
  ) { }

  ngOnInit() {

    this.fecha_inicio= new Date((new Date()).valueOf() - 1000*60*60*24*60)
    this.fecha_fin=new Date()

    this.ListarCuentas();

    this.ListadoCobranzas = new CobranzaDataSource(this.Servicio);
    this.ListadoCobranzas.CargarCobranzas("",0,"",this.fecha_inicio,this.fecha_fin,1,10,"fecha desc");
  }

  ngAfterViewInit () {

    this.sort.sortChange.subscribe(res => {
      this.paginator.pageIndex = 0;
    });

    merge(
      this.paginator.page,
      this.sort.sortChange
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroCliente.nativeElement, 'keyup'),
      fromEvent(this.FiltroOperacion.nativeElement, 'keyup')
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

  ListarCuentas(){
    this.Servicio.ListarCuentas().subscribe(res=>{
      this.Cuentas = res['data'].cuentas ;
    })
  }

  CargarData() {
    this.ListadoCobranzas.CargarCobranzas(
      this.FiltroCliente.nativeElement.value,
      this.FiltroBanco.value,
      this.FiltroOperacion.nativeElement.value,
      this.fecha_inicio,
      this.fecha_fin,
      this.paginator.pageIndex+1,
      this.paginator.pageSize,
      this.sort.active +" " + this.sort.direction
    );
  }

  CambioFiltro(){
    this.paginator.pageIndex = 0;
    this.CargarData()
  }

  EliminarCobranza(cobranza){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "la cobranza", valor: cobranza.numero_operacion+" en el banco "+cobranza.banco }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarCobranzaDirecta(cobranza.id).subscribe(res=>{
          // console.log(res);
          this.CargarData();
        });
      }
    })
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

  CargarCobranzas(
    cliente : string ,
    banco : number ,
    operacion : string ,
    fecha_inicio : Date ,
    fecha_fin : Date ,
    numero_pagina : number ,
    total_pagina : number ,
    orden : string ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCobranzasDirectas( cliente , banco , operacion , fecha_inicio , fecha_fin , numero_pagina , total_pagina , orden )
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
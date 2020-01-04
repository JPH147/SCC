import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSelect, MatPaginator, MatSort, MatDialog } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados.service';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';
import { VentanaInstanciaJudicialComponent } from './ventana-instancia-judicial/ventana-instancia-judicial.component';
import { Notificaciones } from '../../global/notificacion';

@Component({
  selector: 'app-instancia-judicial',
  templateUrl: './instancia-judicial.component.html',
  styleUrls: ['./instancia-judicial.component.css']
})
export class InstanciaJudicialComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoInstancias: InstanciaDataSource;
  public Columnas: string[] = ["numero" , "juzgado_distrito" , "juzgado_instancia" , "opciones"];

  @ViewChild('InputDistrito') FiltroDistrito: ElementRef;
  @ViewChild('InputInstancia') FiltroInstancia: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio: ProcesoJudicialVinculadosService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {

    this.ListadoInstancias = new InstanciaDataSource(this.Servicio);
    this.ListadoInstancias.CargarInformacion("","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroDistrito.nativeElement, 'keyup') ,
      fromEvent(this.FiltroInstancia.nativeElement, 'keyup')
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
    this.ListadoInstancias.CargarInformacion(
      this.FiltroDistrito.nativeElement.value,
      this.FiltroInstancia.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(instancia){
    let Ventana = this.Dialogo.open( VentanaInstanciaJudicialComponent, {
      width: '900px',
      data: instancia
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó la instancia satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar la instancia","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaInstanciaJudicialComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó la instancia satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear la instancia","")
        }
      }
    })
  }

  Eliminar(instancia){
   
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "la instancia judicial", valor: instancia.juzgado_instancia }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarInstanciaJudicial(instancia.id_juzgado_instancia).subscribe(res=>{
          this.CargarData()
        });
      }
    })

  }

}

export class InstanciaDataSource implements DataSource<any> {

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
    distrito_judicial : string ,
    instancia_judicial : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarInstanciasJudiciales( 0 , distrito_judicial , instancia_judicial , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].instancias);
    });
  }

}
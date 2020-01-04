import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatSelect, MatPaginator, MatSort, MatDialog } from '@angular/material'
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ProcesoJudicialVinculadosService } from '../proceso-judicial-vinculados.service';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';
import { VentanaDistritoJudicialComponent } from './ventana-distrito-judicial/ventana-distrito-judicial.component';
import { Notificaciones } from '../../global/notificacion';

@Component({
  selector: 'app-distrito-judicial',
  templateUrl: './distrito-judicial.component.html',
  styleUrls: ['./distrito-judicial.component.css']
})
export class DistritoJudicialComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoDistritos: DistritoDataSource;
  public Columnas: string[] = ["numero" , "nombre" , "opciones"];

  @ViewChild('InputDistrito') FiltroNombre: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private Servicio: ProcesoJudicialVinculadosService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {

    this.ListadoDistritos = new DistritoDataSource(this.Servicio);
    this.ListadoDistritos.CargarInformacion("",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    fromEvent(this.FiltroNombre.nativeElement, 'keyup')
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
    this.ListadoDistritos.CargarInformacion(
      this.FiltroNombre.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(distrito){
    let Ventana = this.Dialogo.open( VentanaDistritoJudicialComponent, {
      width: '900px',
      data: distrito
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó el distrito satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar el distrito","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaDistritoJudicialComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó el distrito satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear el distrito","")
        }
      }
    })
  }

  Eliminar(distrito){
   
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent,{
      data: { objeto: "el distrito", valor: distrito.nombre }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarDistritoJudicial(distrito.id).subscribe(res=>{
          this.CargarData()
        });
      }
    })

  }

}

export class DistritoDataSource implements DataSource<any> {

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
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarDistritosJudiciales( nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].distritos);
    });
  }

}
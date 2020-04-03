import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { InstitucionesService } from '../instituciones.service';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';
import { VentanaParametrosPlantillasComponent } from './ventana-parametros-plantillas/ventana-parametros-plantillas.component';
import { VentanaSedeComponent } from './ventana-sede/ventana-sede.component';
import { Notificaciones } from '../../global/notificacion';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.css']
})

export class SedeComponent implements OnInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoSedes: SedeDataSource;
  public Columnas: string[] = ["numero" , "institucion" , "nombre" , "opciones"];

  @ViewChild('InputInstitucion', { static: true }) FiltroInstitucion: ElementRef;
  @ViewChild('InputSede', { static: true }) FiltroSede: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: InstitucionesService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoSedes = new SedeDataSource(this.Servicio);
    this.ListadoSedes.CargarInformacion("","",1,10);
  }

  ngAfterViewInit () {

    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      fromEvent(this.FiltroInstitucion.nativeElement, 'keyup'),
      fromEvent(this.FiltroSede.nativeElement, 'keyup')
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
    this.ListadoSedes.CargarInformacion(
      this.FiltroInstitucion.nativeElement.value,
      this.FiltroSede.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  EditarParametros(id_sede){
    let Ventana = this.Dialogo.open( VentanaParametrosPlantillasComponent, {
      width: '900px',
      data: id_sede
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizaron los parámetros satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar los parámetros","")
        }
      }
    })
  }

  Editar(sede){
    let Ventana = this.Dialogo.open( VentanaSedeComponent, {
      width: '900px',
      data: sede
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó la sede satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar la sede","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaSedeComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó la sede satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear la sede","")
        }
      }
    })
  }
 
  Eliminar(sede) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la sede', valor: sede.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarSede(sede.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class SedeDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: InstitucionesService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    institucion : string ,
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarSede( institucion , nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].sede);
    });
  }

}
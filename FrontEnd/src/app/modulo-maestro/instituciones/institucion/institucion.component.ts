import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InstitucionesService } from '../instituciones.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaInstitucionComponent } from './ventana-institucion/ventana-institucion.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css']
})
export class InstitucionComponent implements OnInit, AfterViewInit {

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public ListadoInstituciones: InstitucionDataSource;
  public Columnas: string[] = ["numero" , "nombre" , "opciones"];

  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: InstitucionesService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
  ) { }

  ngOnInit() {

    this.ListadoInstituciones = new InstitucionDataSource(this.Servicio);
    this.ListadoInstituciones.CargarInformacion("",1,10);
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
    this.ListadoInstituciones.CargarInformacion(
      this.FiltroNombre.nativeElement.value,
      this.paginator.pageIndex+1,
      this.paginator.pageSize
    );
  }

  Editar(institucion){
    let Ventana = this.Dialogo.open( VentanaInstitucionComponent, {
      width: '900px',
      data: institucion
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se actualizó la institución satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al actualizar la institución","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaInstitucionComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res.resultado){
          this._notificacion.Snack("Se creó la institución satisfactoriamente","");
          this.CargarData();
        }
        if(res.resultado===false){
          this._notificacion.Snack("Ocurrió un error al crear la institución","")
        }
      }
    })
  }

  Eliminar(institucion) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la institución', valor: institucion.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarInstitucion(institucion.id).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

}

export class InstitucionDataSource implements DataSource<any> {

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
    nombre : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarInstitucion( nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].institucion);
    });
  }

}
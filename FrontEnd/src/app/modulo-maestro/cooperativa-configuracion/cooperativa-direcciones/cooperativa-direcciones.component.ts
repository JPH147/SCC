import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CooperativaConfiguracionService } from '../cooperativa-configuracion.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaCooperativaDireccionesComponent } from './ventana-cooperativa-direcciones/ventana-cooperativa-direcciones.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { FormGroup, FormBuilder } from '@angular/forms';
import { VentanaCambiarOrdenComponent } from './ventana-cambiar-orden/ventana-cambiar-orden.component';

@Component({
  selector: 'app-cooperativa-direcciones',
  templateUrl: './cooperativa-direcciones.component.html',
  styleUrls: ['./cooperativa-direcciones.component.css']
})
export class CooperativaDireccionesComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoDirecciones: DireccionDataSource;
  public Columnas: string[] = [ "numero_orden", "departamento" ,"provincia" ,"distrito" ,"cooperativa_direccion" ,"opciones" ];

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public DireccionForm : FormGroup ;

  constructor(
    private Servicio: CooperativaConfiguracionService,
    private Dialogo : MatDialog,
    private _notificacion : Notificaciones,
    private _builder : FormBuilder ,
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListadoDirecciones = new DireccionDataSource(this.Servicio) ;
    this.ListadoDirecciones.CargarInformacion("","","","",0,1,10) ;
  }

  ngAfterViewInit () {
    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      this.DireccionForm.get('departamento').valueChanges ,
      this.DireccionForm.get('provincia').valueChanges ,
      this.DireccionForm.get('distrito').valueChanges ,
      this.DireccionForm.get('direccion').valueChanges ,
      this.DireccionForm.get('estado').valueChanges ,
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

  CrearFormulario() {
    this.DireccionForm = this._builder.group({
      departamento : [ { value : '' , disabled : false },[
      ] ] ,
      provincia : [ { value : '' , disabled : false },[
      ] ] ,
      distrito : [ { value : '' , disabled : false },[
      ] ] ,
      direccion : [ { value : '' , disabled : false },[
      ] ] ,
      estado : [ { value : 0 , disabled : false },[
      ] ] ,
    })
  }

  CargarData() {
    this.ListadoDirecciones.CargarInformacion(
      this.DireccionForm.get('departamento').value ,
      this.DireccionForm.get('provincia').value ,
      this.DireccionForm.get('distrito').value ,
      this.DireccionForm.get('direccion').value ,
      this.DireccionForm.get('estado').value ,
      this.paginator.pageIndex+1 ,
      this.paginator.pageSize
    );
  }

  Editar(direccion){
    let Ventana = this.Dialogo.open( VentanaCooperativaDireccionesComponent, {
      width: '900px',
      data: direccion
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se actualizó la dirección satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al actualizar la dirección","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaCooperativaDireccionesComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se creó la dirección satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al crear la dirección","")
        }
      }
    })
  }

  ActualizarNumerOrden(direccion){
    let Ventana = this.Dialogo.open( VentanaCambiarOrdenComponent, {
      data: { id_direccion : direccion.id_cooperativa_direccion, numero_orden : direccion.numero_orden } ,
      width: '400px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se actualizó el orden de la dirección","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al actualizar el orden de la dirección","")
        }
      }
    })
  }

  Eliminar(direccion) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la dirección', valor: direccion.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarDireccion(direccion.id_cooperativa_direccion).subscribe(() => {
          this.CargarData();
        });
      }
    });
  }

}

export class DireccionDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private Servicio: CooperativaConfiguracionService
  ) { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.Informacion.asObservable();
  }

  disconnect() {
    this.Informacion.complete();
    this.CargandoInformacion.complete();
  }

  CargarInformacion(
    departamento : string ,
    provincia : string ,
    distrito : string ,
    direccion : string ,
    estado : number ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarDirecciones( departamento , provincia , distrito , direccion , estado , numero_pagina , total_pagina
    )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if ( res ) {
        this.TotalResultados.next(res['mensaje']);
        this.Informacion.next(res['data'].direccion);
      } else {
        this.TotalResultados.next(0) ;
        this.Informacion.next([]) ;
      }
    });
  }

}
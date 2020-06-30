import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VentanaPermisosComponent } from './ventana-permisos/ventana-permisos.component';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, fromEvent } from 'rxjs';
import { UsuariosService } from '../usuarios.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Notificaciones } from '../../global/notificacion';
import { VentanaConfirmarComponent } from '../../global/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-permisos-listar',
  templateUrl: './permisos-listar.component.html',
  styleUrls: ['./permisos-listar.component.css']
})
export class PermisosListarComponent implements OnInit {

  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public Columnas : Array<string> = ["numero", "nombre", "opciones"] ;
  public ListadoPerfiles : UsuariosDataSource ;

  constructor(
    private _dialogo : MatDialog ,
    private _usuarios : UsuariosService ,
    private _notificaciones : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoPerfiles = new UsuariosDataSource(this._usuarios) ;
    this.ListadoPerfiles.CargarInformacion("",1,10) ;
  }

  ngAfterViewInit(){
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

  Agregar(){
    let Ventana =  this._dialogo.open(VentanaPermisosComponent,{
      data : false ,
      width : '900px' ,
      maxHeight : '80vh'
  })

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        if( res ) {
          this._notificaciones.Snack("Se creó el perfil satiosfactoriamente","") ;
          this.CargarData() ;
        }
        if( res === false ) {
          this._notificaciones.Snack("Ocurrió un error al crear el perfil","") ;
        }
      }
    })
  }

  VerDetalle( id_perfil ){
    this._dialogo.open( VentanaPermisosComponent, {
      width: '900px' ,
      maxHeight : '80vh' ,
      data : { id_perfil : id_perfil , ver : true}
    } ) ;
  }

  Editar( id_perfil ){
    let Ventana = this._dialogo.open( VentanaPermisosComponent, {
      width: '900px' ,
      maxHeight : '80vh' ,
      data : { id_perfil : id_perfil , editar : true}
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        if( res ) {
          this._notificaciones.Snack("Se actualizó el perfil satiosfactoriamente","") ;
          this.CargarData() ;
        }
        if( res === false ) {
          this._notificaciones.Snack("Ocurrió un error al actualizar el perfil","") ;
        }
      }
    })
  }

  Eliminar( perfil ){
    let Ventana = this._dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el perfil', valor: perfil.nombre}
    });

    Ventana.afterClosed().subscribe(res => {
      if (res === true) {
        this._usuarios.EliminarPerfil(perfil.id_perfil).subscribe(() => {
          this.CargarData();
        });
      }
    });
  }

  CargarData(){
    this.ListadoPerfiles.CargarInformacion(
      this.FiltroNombre.nativeElement.value ,
      this.paginator.pageIndex+1 ,
      this.paginator.pageSize
    )
  }
}

export class UsuariosDataSource implements DataSource<any> {

  private Informacion = new BehaviorSubject<any[]>([]);
  private CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);

  constructor(
    private _usuarios: UsuariosService
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

    this._usuarios.ListarPerfil( nombre , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].perfiles);
    });
  }
}
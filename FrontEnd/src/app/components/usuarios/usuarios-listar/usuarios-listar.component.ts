import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of, merge, fromEvent } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsuariosService } from '../usuarios.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { VentanaUsuariosComponent } from './ventana-usuarios/ventana-usuarios.component' ;
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';

@Component({
  selector: 'app-usuarios-listar',
  templateUrl: './usuarios-listar.component.html',
  styleUrls: ['./usuarios-listar.component.css']
})
export class UsuariosListarComponent implements OnInit {

  @ViewChild('InputNombre', { static: true }) FiltroNombre: ElementRef;
  @ViewChild('InputUsuario', { static: true }) FiltroUsuario: ElementRef;
  @ViewChild('InputRol', { static: true }) FiltroRol: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public Columnas : Array<string> = ["numero", "nombre", "usuario", "perfil", "opciones"] ;
  public ListadoUsuarios : UsuariosDataSource ;

  constructor(
    private Dialogo : MatDialog ,
    private _usuarios : UsuariosService ,
    private _notificaciones : Notificaciones
  ) { }

  ngOnInit() {
    this.ListadoUsuarios = new UsuariosDataSource(this._usuarios) ;
    this.ListadoUsuarios.CargarInformacion("","","",1,10) ;
  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroNombre.nativeElement, 'keyup') ,
      fromEvent(this.FiltroUsuario.nativeElement, 'keyup') ,
      fromEvent(this.FiltroRol.nativeElement, 'keyup') ,
    )
    .pipe(
       debounceTime(200),
       distinctUntilChanged(),
       tap(() => {
         this.paginator.pageIndex = 0;
         this.CargarData();
       })
    ).subscribe();

    this.paginator.page
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.CargarData();
      })
    ).subscribe();
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaUsuariosComponent, {
      width: '900px' ,
    } )

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        if( res.resultado ) {
          this._notificaciones.Snack("Se creó el usuario satiosfactoriamente","") ;
          this.CargarData() ;
        }
        if( res.resultado === false ) {
          this._notificaciones.Snack("Ocurrió un error al crear el usuario","") ;
        }
      }
    })
  }

  Editar( usuario ){
    let Ventana = this.Dialogo.open( VentanaUsuariosComponent, {
      width: '900px' ,
      data : usuario
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        if( res.resultado ) {
          this._notificaciones.Snack("Se actualizó el usuario satiosfactoriamente","") ;
          this.CargarData() ;
        }
        if( res.resultado === false ) {
          this._notificaciones.Snack("Ocurrió un error al actualizar el usuario","") ;
        }
      }
    })
  }

  EditarPss( id_usuario ){
    let Ventana = this.Dialogo.open( VentanaUsuariosComponent, {
      width: '900px' ,
      data : { id_usuario: id_usuario, pss : true }
    } ) ;

    Ventana.afterClosed().subscribe(res=>{
      if( res ) {
        if( res.resultado ) {
          this._notificaciones.Snack("Se actualizó la constraseña satiosfactoriamente","") ;
          this.CargarData() ;
        }
        if( res.resultado === false ) {
          this._notificaciones.Snack("Ocurrió un error al actualizar la contraseña","") ;
        }
      }
    })
  }

  Eliminar( usuario ){
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'el usuario', valor: usuario.nombre}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this._usuarios.EliminarUsuario(usuario.id_usuario).subscribe(res => {
          this.CargarData();
        });
      }
    });
  }

  CargarData(){
    this.ListadoUsuarios.CargarInformacion(
      this.FiltroNombre.nativeElement.value ,
      this.FiltroUsuario.nativeElement.value ,
      this.FiltroRol.nativeElement.value ,
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
    nick : string ,
    rol : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this._usuarios.ListarUsuarios( nombre , nick , rol , numero_pagina , total_pagina )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      this.TotalResultados.next(res['mensaje']);
      this.Informacion.next(res['data'].usuarios);
    });
  }
}
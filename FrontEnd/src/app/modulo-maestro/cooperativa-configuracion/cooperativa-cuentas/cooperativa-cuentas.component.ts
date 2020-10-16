import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { catchError, finalize, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CooperativaConfiguracionService } from '../cooperativa-configuracion.service';
import { VentanaConfirmarComponent } from '../../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { VentanaCooperativaCuentaComponent } from './ventana-cooperativa-cuenta/ventana-cooperativa-cuenta.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';

@Component({
  selector: 'app-cooperativa-cuentas',
  templateUrl: './cooperativa-cuentas.component.html',
  styleUrls: ['./cooperativa-cuentas.component.css']
})
export class CooperativaCuentasComponent implements OnInit, AfterViewInit {
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoCuentas: CuentaDataSource;
  public Columnas: string[] = [ "numero", "banco", "titular", "numero_cuenta" ,"cci" ,"alias" ,"opciones" ];

  public fecha_inicio: Date;
  public fecha_fin: Date;
  public Cuentas : Array<any>;

  public CuentaForm : FormGroup ;
  public Bancos : Array<any> ;

  constructor(
    private Servicio: CooperativaConfiguracionService ,
    private Dialogo : MatDialog ,
    private _notificacion : Notificaciones ,
    private _builder : FormBuilder ,
    private VServicios : ServiciosVentas
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    this.ListarBancos() ;

    this.ListadoCuentas = new CuentaDataSource(this.Servicio) ;
    this.ListadoCuentas.CargarInformacion(0,"",1,10) ;
  }

  ngAfterViewInit () {
    merge(
      this.paginator.page
    ).pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
      this.CuentaForm.get('banco').valueChanges ,
      this.CuentaForm.get('titular').valueChanges ,
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
    this.CuentaForm = this._builder.group({
      banco : [ { value : 0 , disabled : false },[
      ] ] ,
      titular : [ { value : '' , disabled : false },[
      ] ] ,
    })
  }

  ListarBancos() {
    this.VServicios.ListarBancos().subscribe(res=>{
      this.Bancos=res ;
    })
  }

  CargarData() {
    this.ListadoCuentas.CargarInformacion(
      this.CuentaForm.get('banco').value ,
      this.CuentaForm.get('titular').value ,
      this.paginator.pageIndex+1 ,
      this.paginator.pageSize
    );
  }

  Editar(cuenta){
    let Ventana = this.Dialogo.open( VentanaCooperativaCuentaComponent, {
      width: '900px',
      data: cuenta
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se actualizó la cuenta satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al actualizar la cuenta","")
        }
      }
    })
  }

  Agregar(){
    let Ventana = this.Dialogo.open( VentanaCooperativaCuentaComponent, {
      width: '900px',
    })

    Ventana.afterClosed().subscribe(res=>{
      if(res){
        if(res){
          this._notificacion.Snack("Se creó la cuenta satisfactoriamente","");
          this.CargarData();
        }
        if(res===false){
          this._notificacion.Snack("Ocurrió un error al crear la cuenta","")
        }
      }
    })
  }

  Eliminar(cuenta) {
    const VentanaConfirmar = this.Dialogo.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'la cuenta', valor: cuenta.alias}
    });

    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
        this.Servicio.EliminarCuenta(cuenta.id).subscribe(() => {
          this.CargarData();
        });
      }
    });
  }

}

export class CuentaDataSource implements DataSource<any> {

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
    banco : number ,
    titular : string ,
    numero_pagina : number ,
    total_pagina : number ,
  ) {
    this.CargandoInformacion.next(true);

    this.Servicio.ListarCuentas( banco , titular, numero_pagina , total_pagina
    )
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    )
    .subscribe(res => {
      if ( res ) {
        this.TotalResultados.next(res['mensaje']);
        this.Informacion.next(res['data'].cuentas);
      } else {
        this.TotalResultados.next(0) ;
        this.Informacion.next([]) ;
      }
    });
  }

}
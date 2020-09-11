import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {HistorialMovimientosService} from './historial-movimientos.service'
import {HistorialMovimientosDataService} from './historial-movimientos.dataservice'
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {merge, Observable, fromEvent, forkJoin} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, finalize} from 'rxjs/operators';
import {ServiciosGenerales} from 'src/app/core/servicios/servicios';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../../compartido/reducers/permisos.reducer';
import { StockService } from '../stock/stock.service';
import { DetalleDocumentoAlmacenService } from '../detalle-documento-almacen/detalle-documento-almacen.service';
import { MatDialog } from '@angular/material/dialog';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { Notificaciones } from 'src/app/core/servicios/notificacion';

@Component({
  selector: 'app-historial-movimientos',
  templateUrl: './historial-movimientos.component.html',
  styleUrls: ['./historial-movimientos.component.css'],
})

export class HistorialMovimientosComponent implements OnInit {

	@ViewChild('InputAlmacen', { static: true }) FiltroAlmacen: ElementRef;
	@ViewChild('InputTipo', { static: true }) FiltroTipo: MatSelect;
  @ViewChild('InputEstadoTransferencia') FiltroEstadoTransferencia: MatSelect;
	@ViewChild('InputReferente', { static: true }) FiltroReferente: ElementRef;
	@ViewChild('InputDocumento', { static: true }) FiltroDocumento: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public tipo_transaccion:Array<any>;
	public fecha_inicio:Date;
	public fecha_fin:Date;

  ListadoMovimientos: HistorialMovimientosDataService;
  Columnas: string[] = ['numero', 'movimiento','tipo','almacen', 'referencia', 'referente', 'documento', 'fecha', 'opciones'];

  public permiso : Rol ;

  constructor(
    private Dialogo : MatDialog ,
    private _store : Store<EstadoSesion> ,
  	private Servicio: HistorialMovimientosService,
    private SGenerales: ServiciosGenerales ,
    private _stock : StockService ,
    private _detalle : DetalleDocumentoAlmacenService ,
    private _notificacion : Notificaciones
  ) { }

  ngOnInit() {
    this._store.select('permisos').subscribe(permiso =>{
      if( permiso ) {
        this.permiso = permiso ;
      }
    })

  	this.fecha_inicio = null ;
  	this.fecha_fin = null ;

  	this.ListadoMovimientos = new HistorialMovimientosDataService(this.Servicio);
    this.ListadoMovimientos.CargarDatos("",0,0,"",this.fecha_inicio,this.fecha_fin,"",1,10,"fecha desc");

    this.SGenerales.ListarTransaccionTipo("").subscribe(res=>{
      this.tipo_transaccion=res
    })

  }

  ngAfterViewInit(){
  	merge(
      this.paginator.page
    )
    .pipe(
      tap(() =>
      	this.CargarInformacion()
      )
    ).subscribe();

    merge(
      fromEvent(this.FiltroAlmacen.nativeElement, 'keyup'),
      fromEvent(this.FiltroReferente.nativeElement, 'keyup'),
      fromEvent(this.FiltroDocumento.nativeElement, 'keyup'),
      this.sort.sortChange,
      this.FiltroTipo.valueChange,
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.CargarInformacion();
      })
     ).subscribe();
  }

  CargarInformacionEspecial(){
    this.paginator.pageIndex = 0;
    this.CargarInformacion();
  }

  EliminarMovimiento( movimiento ) {
    this.ListadoMovimientos.CargandoInformacion.next(true) ;
    let verificacion : Array<Observable<any>> = [] ;

    this._detalle.SeleccionarCabecera(
      movimiento.id
    ).subscribe( documento => {
      let detalle = documento['data'].detalle ;
      if ( detalle.length == 0 ) {
        this.ListadoMovimientos.CargandoInformacion.next(false) ;
        this.AnularMovimiento(movimiento) ;
      } else {
        detalle.map( (item)=>{
          verificacion.push( this._stock.VerificarStockSerie( item.id_serie) ) ;
          return item ;
        })
        forkJoin(verificacion)
        .pipe(
          finalize(()=>{
            this.ListadoMovimientos.CargandoInformacion.next(false) ;
          })
        )
        .subscribe( stock_series =>{
          if ( stock_series.every( elemento => elemento == 1 ) ) {
            this.AnularMovimiento(movimiento) ;
          } else {
            this._notificacion.Snack("No se puede eliminar porque una de las series ha salido del almacén", "") ;
          }
        })
      }
    } )
  }

  AnularMovimiento(movimiento){
    let Ventana = this.Dialogo.open(VentanaConfirmarComponent ,{
      data: { objeto: "el movimiento", valor: '' }
    })

    Ventana.afterClosed().subscribe(res=>{
      if (res) {
        this.Servicio.EliminarMovimiento(movimiento.id).subscribe( res=>{
          this.CargarInformacion() ;
        });
      }
    })
  }

  CargarInformacion(){
    let estado_transaccion:number;

    if (this.FiltroEstadoTransferencia) {
      estado_transaccion=this.FiltroEstadoTransferencia.value
    }else{
      estado_transaccion=0
    }

  	this.ListadoMovimientos.CargarDatos(
			this.FiltroAlmacen.nativeElement.value,
			this.FiltroTipo.value,
      estado_transaccion,
			this.FiltroReferente.nativeElement.value,
			this.fecha_inicio,
			this.fecha_fin,
			this.FiltroDocumento.nativeElement.value,
			this.paginator.pageIndex+1,
			this.paginator.pageSize,
			this.sort.active + " " + this.sort.direction
		)
  }

}

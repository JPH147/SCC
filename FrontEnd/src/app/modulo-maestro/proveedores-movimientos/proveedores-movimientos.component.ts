import { Component, OnInit, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {MovimientosProveedorDataSource} from '../proveedores/proveedores.dataservice';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {ProveedorService} from '../proveedores/proveedores.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {fromEvent, merge} from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {DetalleDocumentoAlmacenComponent} from '../../modulo-inventarios/detalle-documento-almacen/detalle-documento-almacen.component'

@Component({
  selector: 'app-proveedores-movimientos',
  templateUrl: './proveedores-movimientos.component.html',
  styleUrls: ['./proveedores-movimientos.component.css'],
  providers: [ProveedorService]
})
export class ProveedoresMovimientosComponent implements OnInit {

	@ViewChild('InputProducto', { static: true }) FiltroProducto: ElementRef;
	@ViewChild('InputIMEI', { static: true }) FiltroIMEI: ElementRef;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	public FInicio: Date = new Date((new Date()).valueOf() - 1000*60*60*24*120);
	public FFin:Date = new Date();

  MovimientosProveedoresData: MovimientosProveedorDataSource;
  Columnas: string[] = ['numero','almacen', 'referencia', 'fecha', 'opciones'];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public Servicios: ProveedorService,
    private Dialogo: MatDialog
  ) { }

  ngOnInit() {
  	this.MovimientosProveedoresData = new MovimientosProveedorDataSource(this.Servicios);
  	this.MovimientosProveedoresData.CargarMovimientos(this.data.id,"","", this.FInicio, this.FFin, 1,5)
  }

  ngAfterViewInit(){
    this.paginator.page
    .pipe(
      tap(() => this.CargarData())
    ).subscribe();

    merge(
    	fromEvent(this.FiltroProducto.nativeElement,'keyup'),
    	fromEvent(this.FiltroIMEI.nativeElement,'keyup')
    ).pipe(
    	debounceTime(200),
    	distinctUntilChanged(),
    	tap(()=>{
    		this.CargarData();
    		this.paginator.pageIndex=0;
    	})
    ).subscribe()

  }

  AbrirDetalle(movimiento){
    // console.log(movimiento);
    let Ventana = this.Dialogo.open(DetalleDocumentoAlmacenComponent,{
      width: '1000px',
      data: {id:movimiento.id}
    })
  }

  CargarData(){
  	this.MovimientosProveedoresData.CargarMovimientos(
  		this.data.id,
  		this.FiltroProducto.nativeElement.value,
  		this.FiltroIMEI.nativeElement.value,
  		this.FInicio,
  		this.FFin,
  		this.paginator.pageIndex + 1,
  		this.paginator.pageSize
  	)
  }

}

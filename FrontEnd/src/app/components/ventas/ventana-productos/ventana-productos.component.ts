import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog,MatPaginator} from '@angular/material';
import {ServiciosProductoSerie } from '../../global/productoserie';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-ventana-productos',
  templateUrl: './ventana-productos.component.html',
  styleUrls: ['./ventana-productos.component.css'],
  providers: [ServiciosProductoSerie]
})
export class VentanaProductosComponent implements OnInit {

  ListadoProductos: AgregarProductosDataSource;
  Columnas: string[] = ['serie', 'color', 'almacenamiento', 'proveedor', 'opciones'];

  @ViewChild(MatPaginator) Paginator: MatPaginator;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaProductosComponent>,
  	private Servicio: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
  	this.ListadoProductos = new AgregarProductosDataSource(this.Servicio);
  	this.ListadoProductos.CargarInformacion(this.data.sucursal,this.data.producto,1);
  }

  ngAfterViewInit(){

  	this.Paginator.page
  	.pipe(
  		tap(()=>{
  			this.CargarInformacion()
  		})
  	).subscribe()

  }

  CargarInformacion(){
  	this.ListadoProductos.CargarInformacion(this.data.sucursal,this.data.producto,this.Paginator.pageIndex+1)
  }

}

export class AgregarProductosDataSource {

  public Productos= new BehaviorSubject<any>([]);
  public Total = new BehaviorSubject<number>(0);

  constructor(
  	private Servicio: ServiciosProductoSerie
  ){ }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.Productos.asObservable();
  }
  
  disconnect() {
    this.Productos.complete();
  }
  
  CargarInformacion(
		sucursal:number,
		producto: number,
		pagina_inicial: number,
  ){
    this.Servicio.ListadoSucursal(
			sucursal,
			producto,
			pagina_inicial,
			5
    ).subscribe(res=>{
    	this.Productos.next(res['data'].producto_series);
    	this.Total.next(res['mensaje']);
    })
  }
}
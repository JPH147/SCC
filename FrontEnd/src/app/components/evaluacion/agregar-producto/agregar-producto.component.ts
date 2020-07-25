import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {ProductoService } from '../../detalleproductos/productos/productos.service';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import { ServiciosGenerales, Almacen } from './../../global/servicios';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
  providers: [ProductoService, ServiciosGenerales]
})
export class AgregarProductoComponent implements OnInit {

  ListadoProductos: AgregarProductosDataSource;
  Columnas: string[] = ['descripcion', 'tipo', 'marca', 'modelo', 'precio', 'opciones'];
  @ViewChild('InputProducto', { static: true }) FiltroProducto: ElementRef;
  @ViewChild(MatPaginator, { static: true }) Paginator: MatPaginator;
  public ProductosSeleccionados: Array<any> =[];
  public total: number;
  public Almacenes: Array<Almacen>;
  public almacen:number;

  constructor(
  	@Inject(MAT_DIALOG_DATA) public data,
  	private Ventana: MatDialogRef<AgregarProductoComponent>,
  	private Servicio: ProductoService,
  	private GServicios: ServiciosGenerales,
  ) { }

  ngOnInit() {

    if( this.data.productos.length > 0 ) {
      this.ProductosSeleccionados=this.data.productos;
    }
  	// this.GServicios.ListarAlmacen().subscribe(res=>{
  	// 	this.Almacenes=res;
  	// })

  	this.ListadoProductos = new AgregarProductosDataSource(this.Servicio);
  	this.ListadoProductos.CargarInformacion("",1,this.ProductosSeleccionados);
  	this.total=0;
  }

  ngAfterViewInit(){

  	fromEvent(this.FiltroProducto.nativeElement,'keyup')
  	.pipe(
  		distinctUntilChanged(),
  		debounceTime(200),
  		tap(()=>{
  			this.CargarInformacion();
  			this.Paginator.pageIndex=0;
  		})
  	).subscribe()

  	this.Paginator.page
  	.pipe(
  		tap(()=>{
  			this.CargarInformacion()
  		})
  	).subscribe()

  }

  Agregar(producto){
  	producto.numero++;
  	if (this.ProductosSeleccionados.some(e=>e.id==producto.id)) {
  		this.ProductosSeleccionados.find(e=>e.id==producto.id).numero=producto.numero;
  	}else{
  		this.ProductosSeleccionados.push(producto);	
  	}
  	this.CalcularTotal();
  }

  Quitar(producto){
  	producto.numero--;
  	if (this.ProductosSeleccionados.find(e=>e.id==producto.id).numero>1) {
  		this.ProductosSeleccionados.find(e=>e.id==producto.id).numero=producto.numero;
  	}else{
  		this.ProductosSeleccionados=this.ProductosSeleccionados.filter(e=>e.id!=producto.id)
  	}
  	this.CalcularTotal();
  }

  CalcularTotal(){
  	this.total=0;
  	this.ProductosSeleccionados.forEach((item)=>{
  		this.total+=item.precio*item.numero
  	})
  }

  CargarInformacion(){
  	this.ListadoProductos.CargarInformacion(this.FiltroProducto.nativeElement.value,this.Paginator.pageIndex+1,this.ProductosSeleccionados)
  }

  Guardar(){
	  this.Ventana.close({productos:this.ProductosSeleccionados, total:this.total});
  }

}

export class AgregarProductosDataSource {

  public InformacionProductos= new BehaviorSubject<any>([]);
  public Total = new BehaviorSubject<number>(0);

  constructor(
  	private Servicio: ProductoService
  ){ }

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.InformacionProductos.asObservable();
  }
  
  disconnect() {
    this.InformacionProductos.complete();
  }
  
  CargarInformacion(
		descripcion: string,
		pagina: number,
		ProductosAgregados: Array<any>
  ){
    this.Servicio.Listado(
      '',
      '',
      '',
      descripcion,
      null,
      null,
      pagina,
      5,
      "precio",
      "asc",
      1
    ).subscribe(res=>{
    	res['data'].productos.forEach((item)=>{
    		item.numero=0;
    		if (ProductosAgregados.some(e=>e.id==item.id)) {
    			item.numero=ProductosAgregados.find(e=>e.id==item.id).numero
    		}
    	});
    	this.InformacionProductos.next(res['data'].productos);
    	this.Total.next(res['mensaje']);
    })
  }
}
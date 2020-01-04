import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog,MatPaginator} from '@angular/material';
import {ServiciosProductoSerie } from '../../global/productoserie';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged, debounce} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';

@Component({
  selector: 'app-ventana-productos',
  templateUrl: './ventana-productos.component.html',
  styleUrls: ['./ventana-productos.component.css'],
  providers: [ServiciosProductoSerie]
})
export class VentanaProductosComponent implements OnInit, AfterViewInit {

  @ViewChild('InputSerie') FiltroSerie: ElementRef;
  @ViewChild(MatPaginator) Paginator: MatPaginator;
  
  Columnas: string[] = ['serie', 'color', 'almacenamiento', 'almacen', 'opciones'];
  ListadoProductos: AgregarProductosDataSource;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaProductosComponent>,
  	private Servicio: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
  	this.ListadoProductos = new AgregarProductosDataSource(this.Servicio);
  	this.ListadoProductos.CargarInformacion(this.data.series,this.data.sucursal,this.data.producto,"",1);
    // console.log(this.data)
  }

  ngAfterViewInit(){
    fromEvent( this.FiltroSerie.nativeElement, 'keyup' )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
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

  CargarInformacion(){
    this.ListadoProductos.CargarInformacion(
      this.data.series,
      this.data.sucursal,
      this.data.producto,
      this.FiltroSerie.nativeElement.value,
      this.Paginator.pageIndex+1
    )
  }

}

export class AgregarProductosDataSource {

  public Productos= new BehaviorSubject<any>([]);
  public Total = new BehaviorSubject<number>(0);
  public Cargando = new BehaviorSubject<boolean>(false);

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
    series_registradas:Array<any>,
		sucursal:number,
    producto: number,
    serie:string,
		pagina_inicial: number,
  ){
    this.Cargando.next(true);
    this.Servicio.ListadoSucursal(
			sucursal,
      producto,
      serie,
			pagina_inicial,
			5
    ).subscribe(res=>{
      this.Cargando.next(false);
      // console.log(res['data'].producto_series)

      // Si la serie ya ha sido agregada, no se permite ingresarla dos veces.
      // En este caso, se está utilizado "número" como "utilizado"
      // console.log(res['data'].producto_series,series_registradas)
      res['data'].producto_series.forEach((item)=>{
        item.numero=false;
        series_registradas.forEach((element)=>{
          if (item.id_serie == element) {
            item.numero=true
          }
        })
      })

    	this.Productos.next(res['data'].producto_series);
      // console.log("a")
    	this.Total.next(res['mensaje']);
    })
  }
}
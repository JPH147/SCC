import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {ServiciosProductoSerie } from 'src/app/core/servicios/productoserie';
import { BehaviorSubject,Observable, fromEvent, merge } from 'rxjs';
import {tap, debounceTime, distinctUntilChanged, debounce} from 'rxjs/operators';
import {CollectionViewer} from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-ventana-productos',
  templateUrl: './ventana-productos.component.html',
  styleUrls: ['./ventana-productos.component.css'],
  providers: [ServiciosProductoSerie]
})
export class VentanaProductosComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) Paginator: MatPaginator;
  @ViewChild('InputProducto', { static: true }) FiltroProducto: ElementRef;
  @ViewChild('InputSerie', { static: true }) FiltroSerie: ElementRef;
  
  Columnas: string[] = ['producto', 'serie', 'color', 'almacenamiento', 'opciones'];
  ListadoProductos: AgregarProductosDataSource;

  private SeriesSeleccionadas : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaProductosComponent>,
  	private Servicio: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
  	this.ListadoProductos = new AgregarProductosDataSource(this.Servicio);
  	this.ListadoProductos.CargarInformacion(this.data.series,this.data.sucursal,"","",1) ;
    if ( this.data.productos.length > 0 ) {
      this.data.productos.forEach(( item ) => {
        let producto = {
          id_producto : item.id_producto ,
          producto : item.nombre ,
          id_serie : item.id_serie ,
          serie : item.serie ,
          precio : item.precio ,
          estado : item.estado
        } ;
        this.SeriesSeleccionadas.push(producto) ;
      })
      // this.SeriesSeleccionadas = this.data.producos ;
    }
  }

  ngAfterViewInit(){
    merge(
      fromEvent( this.FiltroSerie.nativeElement, 'keyup' ) ,
      fromEvent( this.FiltroProducto.nativeElement, 'keyup' ) ,
    )
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
      this.FiltroProducto.nativeElement.value,
      this.FiltroSerie.nativeElement.value,
      this.Paginator.pageIndex+1
    )
  }

  SerieSeleccionada( evento : MatCheckboxChange, serie : any ) {
    if ( evento.checked ) {
      this.AgregarSerie(serie) ;
    } else {
      this.QuitarSerie(serie) ;
    }
  }

  AgregarSerie( serie ){
    this.SeriesSeleccionadas.push(serie) ;
  }

  QuitarSerie( serie ) {
    this.SeriesSeleccionadas = this.SeriesSeleccionadas.filter(e => e.id_serie != serie.id_serie ) ;
  }

  GuardarSeries() {
    this.ventana.close(this.SeriesSeleccionadas) ;
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
    producto: string,
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
      // Si la serie ya ha sido agregada, no se permite ingresarla dos veces.
      // En este caso, se está utilizado "número" como "utilizado"
      // console.log(res['data'].producto_series,series_registradas)
      res['data'].producto_series.map((producto)=>{
        producto.numero=false;
        series_registradas.map((serie)=>{
          if (producto.id_serie == serie) {
            producto.numero=true ;
          }
          return serie ;
        })
        return producto ;
      })
    	this.Productos.next(res['data'].producto_series);
    	this.Total.next(res['mensaje']);
    })
  }
}
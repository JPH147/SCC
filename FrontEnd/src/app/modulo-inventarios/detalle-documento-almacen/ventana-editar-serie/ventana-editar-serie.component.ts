import { Component, AfterViewInit, OnInit, Inject, ViewChild, ElementRef, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ServiciosProductoSerie} from 'src/app/core/servicios/productoserie';
import {fromEvent, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap, finalize} from 'rxjs/operators';
import {ProductoService} from '../../detalleproductos/productos/productos.service';
import { IngresoProductoService } from '../../ingreso-productos/ingreso-productos.service';

@Component({
  selector: 'app-ventana-editar-serie',
  templateUrl: './ventana-editar-serie.component.html',
  styleUrls: ['./ventana-editar-serie.component.css'],
  providers: [ ServiciosProductoSerie, ProductoService, IngresoProductoService ]
})
export class VentanaEditarSerieComponent implements OnInit, AfterViewInit {

  public Cargando = new BehaviorSubject<boolean>(false);
  
  @ViewChild('InputProducto') FiltroProducto: ElementRef;
  @ViewChild('InputSerie', { static: false }) FiltroSerie: ElementRef;
	public EditarSerieForm: FormGroup;
  public Informacion:any = {id:null, id_producto:null,serie:"", color:"", almacenamiento:"",precio:0};
  public repetido: boolean;
  public verificando:boolean;
  public nuevo : boolean = false ;
  public id_producto : number ;
  public producto : string ;
  public Producto: Array<any>;
  public hay_serie : boolean = true ;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private ventana : MatDialogRef<VentanaEditarSerieComponent> ,
    private Builder: FormBuilder,
    private SServicio: ServiciosProductoSerie,
    private Articulos: ProductoService,
    private IngresoProductoservicios: IngresoProductoService
  ) { }

  ngOnInit() {
    if(this.data.detalle){
      this.repetido=false;
      this.verificando=false;
      this.ActualizarInformacion();
      if ( this.data.detalle.tiene_serie == 1 ) {
        this.hay_serie = true ;
      } else {
        this.hay_serie = false ;
      }
    } else {
      this.nuevo = true ;
    }

    console.log(this.data.detalle.tiene_serie) ;

    this.FiltrarProductos("");
  }

  ngAfterViewInit(){
    this.FiltrarSerie();
    this.SServicio.ValidarSerie(
      this.Informacion.serie,
      this.data.detalle ? this.data.detalle.id_serie : 0
    ).subscribe(res=>{
      this.verificando=false;
      if (res==0) {
        this.repetido=false;                
      }else{
        this.repetido=true;
      }
    })

    if(this.nuevo){
      fromEvent(this.FiltroProducto.nativeElement,'keyup')
      .pipe(
        debounceTime(10),
        distinctUntilChanged(),
        tap(() => {
          this.FiltrarProductos(this.FiltroProducto.nativeElement.value);
        })
       ).subscribe();
      }
    }

  FiltrarSerie(){
    fromEvent(this.FiltroSerie.nativeElement,'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.verificando=true;
        this.SServicio.ValidarSerie(
          this.FiltroSerie.nativeElement.value.trim(),
          this.data.detalle ? this.data.detalle.id_serie : 0
        ).subscribe(res=>{
          this.verificando=false;
          if (res==0) {
            this.repetido=false;                
          }else{
            this.repetido=true;
          }
        })
      })
    ).subscribe()
  }

  ActualizarInformacion(){
    this.Cargando.next(true);
    if ( this.data.detalle.tiene_serie == 1 ) {
      // this.hay_serie = true ;

      this.SServicio.ValidarSerie(this.data.detalle.serie,this.data.detalle.id_serie).subscribe(res=> {
        this.SServicio.Seleccionar(this.data.detalle.id_serie).subscribe(res=>{
          this.Cargando.next(false);
          this.Informacion.id=res.id_producto_serie;
          this.Informacion.id_producto=res.id_producto;
          this.Informacion.serie=res.serie;
          this.Informacion.color=res.color;
          this.Informacion.almacenamiento=res.almacenamiento;
          this.Informacion.precio=res.precio;
        })
      })
    } else {
      // this.hay_serie = false ;

      this.SServicio.Seleccionar(this.data.detalle.id_serie).subscribe(res=>{
        this.Cargando.next(false);
        this.Informacion.id=res.id_producto_serie;
        this.Informacion.id_producto=res.id_producto;
        this.Informacion.serie=res.serie;
        this.Informacion.color=res.color;
        this.Informacion.almacenamiento=res.almacenamiento;
        this.Informacion.precio=res.precio;
      })
    }

  }

  displayFn2(producto) {
    if (producto) {
      return producto.descripcion;
    } else {
      return '';
    }
  }

  FiltrarProductos(filtro){
    this.Articulos.Listado('','','',filtro,null,null,1,10,'descripcion','asc',1).subscribe(res=>{
      this.Producto=res['data'].productos;
    })
  }

  ProductoSeleccionado(evento){
    this.Producto=[];
    this.Informacion.id_producto = evento.option.value.id ;
    if (evento.option.value.tiene_serie == 1 ) {
      this.hay_serie = true ;
    } else {
      this.hay_serie = false ;
    }
  }

  RemoverProducto(){
    this.Informacion.id_producto = null ;
    this.producto = "" ;
    this.FiltrarProductos("");
    this.hay_serie = true ;
  }

  Guardar(){
    this.Cargando.next(true) ;
    if (this.data.detalle) {
      this.Actualizar();
    } else {
      this.Crear();
    }
  }

  Crear(){
    if ( !this.hay_serie ) {
      this.Informacion.serie = new Date().getTime() + "-" + 1 ;
    }
    this.SServicio.CrearProductoSerie(
      this.Informacion.id_producto,
      this.Informacion.serie,
      this.Informacion.color,
      this.Informacion.almacenamiento,
      this.Informacion.precio
    ).subscribe(response => {
      if( response['codigo']==0 ) {
        this.IngresoProductoservicios.CrearTransaccionDetalle(this.data.transaccion, response['data'], 1, this.Informacion.precio, "")
        .pipe(
          finalize(()=>{
            this.Cargando.next(false) ;
          })
        )
        .subscribe(resp=>{
          if( resp['codigo']==0 ) {
            this.ventana.close(true) ;
          } else {
            this.ventana.close(false) ;
          }
        });
      } else {
        this.ventana.close(false) ;
      }
    });
  }

  Actualizar(){
    this.SServicio.ValidarSerie(this.Informacion.serie,this.Informacion.id).subscribe(rest=>{
      if (rest==0) {
        this.SServicio.Actualizar(
          this.Informacion.id,
          this.Informacion.id_producto,
          this.Informacion.serie,
          this.Informacion.color,
          this.Informacion.almacenamiento,
          this.Informacion.precio
        )
        .pipe(
          finalize(()=>{
            this.Cargando.next(false) ;
          })
        )
        .subscribe(res=>{
          if(res['codigo']==0){
            this.ventana.close(true)
          } else {
            this.ventana.close(false)
          }
        })
      }else{
        this.repetido = true ;
      }
    })
  }

}

import { Component, AfterViewInit, OnInit, Inject, ViewChild, ElementRef, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {ProductoService} from '../../productos/productos.service';

@Component({
  selector: 'app-ventana-editar-serie',
  templateUrl: './ventana-editar-serie.component.html',
  styleUrls: ['./ventana-editar-serie.component.css'],
  providers: [ ServiciosProductoSerie, ProductoService ]
})
export class VentanaEditarSerieComponent implements OnInit, AfterViewInit {

  @ViewChild ('InputProducto') FiltroProducto: ElementRef;
  @ViewChild ('InputSerie') FiltroSerie: ElementRef;
	public EditarSerieForm: FormGroup;
  public Informacion:any = {id:null, id_producto:null,serie:"", color:"", almacenamiento:"",precio:0};
  public repetido: boolean;
  public verificando:boolean;
  public Cargando = new BehaviorSubject<boolean>(false);
  public nuevo : boolean = false ;
  public id_producto : number ;
  public producto : string ;
  public Producto: Array<any>;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data,
    private Builder: FormBuilder,
    private SServicio: ServiciosProductoSerie,
    private Articulos: ProductoService,
  ) { }

  ngOnInit() {
    if(this.data){
      this.repetido=false;
      this.verificando=false;
      this.ActualizarInformacion();
    } else {
      this.nuevo = true ;
    }

    this.FiltrarProductos("");
  }

  ngAfterViewInit(){
    this.FiltrarSerie();
    this.SServicio.ValidarSerie(
      this.Informacion.serie,
      this.data ? this.data.id_serie : 0
    ).subscribe(res=>{
      this.verificando=false;
      if (res==0) {
        this.repetido=false;                
      }else{
        this.repetido=true;
      }
    })

    fromEvent(this.FiltroProducto.nativeElement,'keyup')
    .pipe(
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        this.FiltrarProductos(this.FiltroProducto.nativeElement.value);
      })
     ).subscribe();
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
          this.data ? this.data.id_serie : 0
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
    this.SServicio.ValidarSerie(this.FiltroSerie.nativeElement.value.trim(),this.data.id_serie).subscribe(res=> {
      this.SServicio.Seleccionar(this.data.id_serie).subscribe(res=>{
        this.Cargando.next(false);
        this.Informacion.id=res.id_producto_serie;
        this.Informacion.id_producto=res.id_producto;
        this.Informacion.serie=res.serie;
        this.Informacion.color=res.color;
        this.Informacion.almacenamiento=res.almacenamiento;
        this.Informacion.precio=res.precio;
      })
    })

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
  }

  RemoverProducto(){
    this.Informacion.id_producto = null ;
    this.producto = "" ;
    this.FiltrarProductos("");
  }

}

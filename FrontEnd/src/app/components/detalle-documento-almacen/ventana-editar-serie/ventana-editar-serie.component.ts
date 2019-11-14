import { Component, AfterViewInit, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent, BehaviorSubject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
  selector: 'app-ventana-editar-serie',
  templateUrl: './ventana-editar-serie.component.html',
  styleUrls: ['./ventana-editar-serie.component.css'],
  providers: [ServiciosProductoSerie]
})
export class VentanaEditarSerieComponent implements OnInit {

  @ViewChild ('InputSerie') FiltroSerie: ElementRef;
	public EditarSerieForm: FormGroup;
  public Informacion:any = {id:null, id_producto:null,serie:"", color:"", almacenamiento:"",precio:null};
  public repetido: boolean;
  public verificando:boolean;
  public Cargando = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private Builder: FormBuilder,
    private SServicio: ServiciosProductoSerie,
  ) { }

  ngOnInit() {

    this.ActualizarInformacion();
    this.repetido=false;
    this.verificando=false;
  }

  ngAfterViewInit(){
    
    this.FiltrarSerie();
    this.SServicio.ValidarSerie(this.Informacion.serie,this.data.id_serie).subscribe(res=>{
      this.verificando=false;
      if (res==0) {
        this.repetido=false;                
      }else{
        this.repetido=true;
      }
    })

  }

  FiltrarSerie(){
    fromEvent(this.FiltroSerie.nativeElement,'keyup')
    .pipe(
      distinctUntilChanged(),
      debounceTime(200),
      tap(()=>{
        this.verificando=true;
        this.SServicio.ValidarSerie(this.FiltroSerie.nativeElement.value.trim(),this.data.id_serie).subscribe(res=>{
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

}

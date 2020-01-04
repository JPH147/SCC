import { Component, OnInit, Inject, ViewChildren, QueryList, } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent, forkJoin, of} from 'rxjs';
import {tap, distinctUntilChanged, debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-ventanaseries',
  templateUrl: './ventanaseries.html',
  styleUrls: ['./ventanaseries.css'],
  providers: [ServiciosProductoSerie]
})

export class ventanaseries  implements OnInit {

  @ViewChildren('InputSerie') FiltroSerie: QueryList<any>;
  @ViewChildren('InputColor') FiltroColor: QueryList<any>;
  public seriearticulo: Array<any> = [];
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;
  public colores: Array<any>;
  public invalidBD:boolean;
  public invalidV:boolean;
  public invalidP:boolean;
  public series_vista:Array<any> = [];
  public cargando:boolean;
  public consultar_numero_items : boolean = false ;
  public numero_items : number = 1 ;
  public precio_minimo : number = 0 ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaseries>,
    private Servicios: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
    // console.log(this.data,this.data.producto);
    this.cargando=false;
    this.invalidV=false;
    this.invalidBD=false;
    this.invalidP=false;
    this.contador = 1;
    this.seriearticulo = [{numero: this.contador, producto:this.data.producto,serie: '', color:'', almacenamiento:'', observacion:"", precio: this.precio_minimo, repetidoBD:false, repetidoV:false, repetidoP:false} ];
    this.ListarColores("");

    if (this.data.series.length>0) {
      this.series_vista=this.data.series;
      // console.log(this.data.series)
      let is:number=0;
      for (let i of this.data.series) {
        if (this.data.producto==i.id_producto) {
          this.seriearticulo.push({numero:this.contador, producto: this.data.producto,  serie:i.serie, color:i.color, almacenamiento:i.almacenamiento, observacion:i.observacion, precio:i.precio, repetidoBD:false, repetidoV:false, repetidoP:false})
          this.contador++;
          is++;
          this.invalidV=false;
          this.invalidBD=true;
        }
      }

      if (is>0) {
        this.seriearticulo.splice(0,1)
      }else{
        
      }

    } else {
      this.consultar_numero_items = true ;
    }

  }

  ngAfterViewInit(){
    this.ValidarBD();
    this.FiltrarColores();
    this.FiltrarSerie();
    this.FiltrarSerieVista();
  }

  SeleccionarNumeroSeries(){
    this.consultar_numero_items = false ;
    this.seriearticulo[0].precio = this.precio_minimo ;
    for(let i = this.seriearticulo.length ; i < this.numero_items ; i++) {
      this.AgregarSerieVS();
    }
  }

  ValidarBD(){
    this.seriearticulo.forEach((item,index)=>{
      this.Servicios.ValidarSerie(item.serie,0).subscribe(res=>{
        if (res==0) {
          this.seriearticulo[index].repetidoBD=false;
        }else{
          this.seriearticulo[index].repetidoBD=true;
        }
        this.Comprobar();
      })
    })
  }

  FiltrarSerieVista(){
    this.FiltroSerie.changes.subscribe(res=>{
      for(let i in this.FiltroSerie['_results']){
        fromEvent(this.FiltroSerie['_results'][i].nativeElement,'keyup')
        .pipe(
          distinctUntilChanged(),
          debounceTime(200),
          tap(()=>{
            if (this.seriearticulo.length>1) {
              if(this.FiltroSerie['_results'][i].nativeElement.value.trim()){
                this.DuplicadosVista(this.FiltroSerie['_results'][i].nativeElement.value.trim(),i)
              }
            }
            this.Comprobar();
          })
        ).subscribe()
      }
    })
  }

  FiltrarSerie(){
    // this.Servicios.ValidarSerie()
    this.FiltroSerie.changes.subscribe(res=>{
      for(let i in this.FiltroSerie['_results']){
        fromEvent(this.FiltroSerie['_results'][i].nativeElement,'keyup')
        .pipe(
          distinctUntilChanged(),
          debounceTime(200),
          tap(()=>{
            if(this.FiltroSerie['_results'][i].nativeElement.value.trim()){
              // this.DuplicadosVista(this.FiltroSerie['_results'][i].nativeElement.value,i.trim());
              this.Servicios.ValidarSerie(this.FiltroSerie['_results'][i].nativeElement.value.trim(),0).subscribe(res=>{
                if (res==0) {
                  this.seriearticulo[i].repetidoBD=false;
                }else{
                  this.seriearticulo[i].repetidoBD=true;
                }
                this.Comprobar();
              })
            }
            // this.Comprobar();
          })
        ).subscribe()
      }
    })
  };

  FiltrarColores(){
    this.FiltroColor.changes.subscribe(res=>{
      for (let i of this.FiltroColor['_results']) {
        fromEvent(i.nativeElement,'keyup')
        .pipe(
          distinctUntilChanged(),
          debounceTime(200),
          tap(()=>{
            if (i.nativeElement.value) {
              this.ListarColores(i.nativeElement.value)
            }
          })
        ).subscribe()
      }
    })
  }

  ColorSeleccionado(){
    this.ListarColores('')
  }

  AgregarSerieVS() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, producto: this.data.producto, serie: '', color:'', almacenamiento:'', observacion:"", precio: this.precio_minimo, repetidoBD:false, repetidoV:false, repetidoP:false});
  }

  EliminarElemento(array,value){
    array.forEach( (item, index) => {
      if(item.id_producto == value) array.splice(index,1);
    });
  }

  onNoClick(){
    this.ventana.close();
    return false
  }

  ListarColores(valor){
    this.Servicios.ListarColor(valor).subscribe(res=>{
      this.colores=res
    })
  }

  Duplicados() {
    let object = {};
    let result = [];

    this.seriearticulo.forEach(item => {
      if(!object[item.serie])
        object[item.serie] = 0;
      object[item.serie] += 1;
    })

    for (let prop in object) {
      if(object[prop] >= 2) {
        result.push(prop);
      }
    }

    return result.length;

  }

  // Para saber si se agregó la misma serie a otro producto
  DuplicadosVista(value,i){
    let contador=0;
    let duplicado=0;
    // console.log(control)
    this.seriearticulo.forEach((item,index)=>{
      contador++;
      if (item.serie == value) {
        duplicado++;
      }
      if (contador==this.seriearticulo.length) {
        if (duplicado>1) {
          this.seriearticulo[i].repetidoV=true
        }else{
          this.seriearticulo[i].repetidoV=false
        }
      }
    })
  }

  DuplicadosTotales(){
    let contador=0;
    let duplicado=0;
    this.seriearticulo.forEach((item,index)=>{
      this.seriearticulo.forEach((item2,index2)=>{
        if (item.serie==item2.serie) {
          this.contador++;
        }
      })
      if (contador>1) {
        duplicado++;
      }else{
        contador=0;
      }
    })
  }

  EliminarEspacios(){
    this.seriearticulo.forEach((item)=>{
      item.serie=item.serie.trim()
    })
  }

  ComprobarVista(){
    this.invalidV=false;
    if (this.seriearticulo.some(e=>e.repetidoV==true)) {
      this.invalidV=true
      return of(true);
    }else{
      this.invalidV=false
      return of(false);
    }
  }

  ComprobarPagina(){
    this.invalidP=false;
    // if (this.seriearticulo.some(e=>e.repetidoP==true)) {
    //   this.invalidP=true;
    //   return of(true);
    // }else{
    //   this.invalidP=false;
    //   return of(false);
    // }
    let i : number = 0;

    if( this.series_vista.length > 0 ){
      this.seriearticulo.forEach((item=>{
        this.series_vista.forEach((item2)=>{
          if(item.serie == item2.serie && item.producto != item2.id_producto){
            this.invalidP=true;
            return of(true);
          } 
        })
        i++;
        if(i==this.seriearticulo.length && !this.invalidP){
          this.invalidP=false;
          return of(false);
        }
      }))
    }

  }  

  ComprobarBD(){
    this.invalidBD=false;
    if (this.seriearticulo.some(e=>e.repetidoBD==true)) {
      this.invalidBD=true;
      return of(true);
    }else{
      this.invalidBD=false;
      return of(false);
    }
  }

  Comprobar(){
    this.EliminarEspacios();

    this.ComprobarPagina();
    
    return forkJoin(
      this.ComprobarVista(),
      // this.ComprobarPagina(),
      this.ComprobarBD()
    ).subscribe(res=>{
      // console.log(res);
      this.cargando=false;
    })
    
  }

  Aceptar() {
    return this.seriearticulo
  }

}
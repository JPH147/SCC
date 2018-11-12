import { Component, OnInit, Inject, ViewChildren, QueryList } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent} from 'rxjs';
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
  public series_vista:Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaseries>,
    private Servicios: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
    // console.log(this.data,this.data.producto);
    this.invalidV=false;
    this.invalidBD=false;
    this.contador = 1;
    this.seriearticulo = [{numero: this.contador, producto:this.data.producto,serie: '', color:'', almacenamiento:'', observacion:"", repetido:false} ];
    this.ListarColores("");

    if (this.data.series.length>0) {
      this.series_vista=this.data.series;
      console.log(this.data.series)
      let is:number=0;
      for (let i of this.data.series) {
        if (this.data.producto==i.id_producto) {
          this.seriearticulo.push({numero:this.contador, producto: this.data.producto,  serie:i.serie, color:i.color, almacenamiento:i.almacenamiento, observacion:i.observacion, repetido:false})
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

    }else{
      // this.seriearticulo = [{numero: this.contador, producto:this.data.producto,series: ''} ];
    }

  }

  ngAfterViewInit(){
    this.FiltrarColores();
    this.FiltrarSerie();
    this.FiltrarSerieVista()
  }

  FiltrarSerieVista(){
    this.FiltroSerie.changes.subscribe(res=>{
      for(let i in this.FiltroSerie['_results']){
        fromEvent(this.FiltroSerie['_results'][i].nativeElement,'keyup')
        .pipe(
          distinctUntilChanged(),
          debounceTime(200),
          tap(()=>{
            // console.log(this.seriearticulo.some(e=>e.serie==this.FiltroSerie['_results'][i].nativeElement.value.trim()))
            if (this.seriearticulo.length>1) {
              if(this.FiltroSerie['_results'][i].nativeElement.value){
                if(this.Duplicados()==0){
                  this.invalidV=false
                }else{
                  this.invalidV=true
                }
              }
            }
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
            if(this.FiltroSerie['_results'][i].nativeElement.value){
              this.DuplicadosVista(this.FiltroSerie['_results'][i].nativeElement.value);
              this.Servicios.ValidarSerie(this.FiltroSerie['_results'][i].nativeElement.value.trim()).subscribe(res=>{
                if (res==1) {
                  this.seriearticulo[i].repetido=true;
                  this.invalidBD=false;
                }else{
                  this.seriearticulo[i].repetido=false;
                  this.invalidBD=true;
                }
              })
            }
          })
        ).subscribe()
      }
    })
  }

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
    this.seriearticulo.push({numero: this.contador, producto: this.data.producto, serie: '', color:'', almacenamiento:'', observacion:"", repetido:false});
  }

  Aceptar() {
    return this.seriearticulo
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
  DuplicadosVista(value){
    if (this.series_vista) {
      this.invalidP=this.series_vista.some(e=>e.serie==value)
    }
  }

}
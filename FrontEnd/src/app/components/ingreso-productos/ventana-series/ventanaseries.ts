import { Component, OnInit, Inject, ViewChildren, QueryList } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {ServiciosProductoSerie} from '../../global/productoserie';
import {fromEvent} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-ventanaseries',
  templateUrl: './ventanaseries.html',
  styleUrls: ['./ventanaseries.css'],
  providers: [ServiciosProductoSerie]
})

export class ventanaseries  implements OnInit {

  @ViewChildren('InputColor') FiltroColor: QueryList<any>;
  public seriearticulo: Array<any> = [];
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;
  public colores: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaseries>,
    private Servicios: ServiciosProductoSerie,
  ) { }

  ngOnInit() {
    // console.log(this.data,this.data.producto);
    this.contador = 1;
    this.seriearticulo = [{numero: this.contador, producto:this.data.producto,serie: '', color:'', almacenamiento:'', observacion:""} ];
    this.ListarColores("");

    if (this.data.series.length>0) {
      let is:number=0;
      for (let i of this.data.series) {
        if (this.data.producto==i.id_producto) {
          this.seriearticulo.push({numero:this.contador, producto: this.data.producto,  serie:i.serie, color:i.color, almacenamiento:i.almacenamiento, observacion:i.observacion})
          this.contador++;
          is++;
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
    this.FiltrarColores()
  }

  FiltrarColores(){
    this.FiltroColor.changes.subscribe(res=>{
      for (let i in this.FiltroColor['_results']) {
        fromEvent(this.FiltroColor['_results'][i].nativeElement,'keyup')
        .pipe(
            tap(()=>{
              if (this.FiltroColor['_results'][i].nativeElement.value) {
                this.ListarColores(this.FiltroColor['_results'][i].nativeElement.value)
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
    this.seriearticulo.push({numero: this.contador, producto: this.data.producto, serie: '', color:'', almacenamiento:'', observacion:""});
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

}

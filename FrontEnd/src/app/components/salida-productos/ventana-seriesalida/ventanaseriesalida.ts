import { Component, OnInit, Inject } from '@angular/core';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie';

@Component({
  selector: 'app-ventanaseriesalida',
  templateUrl: './ventanaseriesalida.html',
  styleUrls: ['./ventanaseriesalida.css'],
  providers:[ServiciosProductoSerie]
})

// tslint:disable-next-line:class-name
export class ventanaseriesalida  implements OnInit {
  public SeriesProductosForm:FormGroup;
  public series: FormArray;
  public Productos:Array<any>;
  public contador:number=0

  constructor(
     @Inject(MAT_DIALOG_DATA) public data,
      public ventana: MatDialogRef<ventanaseriesalida>,
      private FormBuilder: FormBuilder,
      private Series:ServiciosProductoSerie
  ) { }

  ngOnInit() {

    this.SeriesProductosForm = this.FormBuilder.group({
      series: this.FormBuilder.array([this.CrearSerie()])
    })

    if (this.data.series) {
      // console.log(this.data)
      this.data.series.forEach((item,index)=>{
        if (item.id_producto==this.data.id_producto) {
          this.contador++
        }
      })
      if (this.contador>0) {
        // console.log(this.contador)
        let i:number=0;
        this.data.series.forEach((item,index)=>{
          if (item.id_producto==this.data.id_producto) {
            this.SeriesProductosForm.get('series')['controls'][i].get('id_producto').setValue(item.id_producto);
            this.SeriesProductosForm.get('series')['controls'][i].get('id_serie').setValue(item.id_serie);
            this.SeriesProductosForm.get('series')['controls'][i].get('serie').setValue(item.serie);
            this.SeriesProductosForm.get('series')['controls'][i].get('serie_mostrar').setValue(item.serie);
            this.SeriesProductosForm.get('series')['controls'][i].get('color').setValue(item.color);
            this.SeriesProductosForm.get('series')['controls'][i].get('color_mostrar').setValue(item.color);
            this.SeriesProductosForm.get('series')['controls'][i].get('almacenamiento').setValue(item.almacenamiento);
            this.SeriesProductosForm.get('series')['controls'][i].get('almacenamiento_mostrar').setValue(item.almacenamiento);
            this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(item.precio);
            this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(1);
            this.SeriesProductosForm.get('series')['controls'][i].get('cantidad_mostrar').setValue(1);
            this.SeriesProductosForm.get('series')['controls'][i].get('considerar').setValue(item.considerar);
            this.AgregarSerie();
            i++;
          }
        })
        this.EliminarSerie(i)
      }  
      else{
        this.Series.Listado(this.data.almacen,this.data.id_producto,1,100).subscribe(res=>{
          this.ListadoSeries(res['data'].producto_series);
        })
      }
    }


  }

  CrearSerie():FormGroup{
    return this.FormBuilder.group({
      'id_producto':[{value:null, disabled:false},[
      ]],
      'id_serie':[{value:null, disabled:false},[
      ]],
      'serie':[{value:null, disabled:false},[
      ]],
      'serie_mostrar':[{value:null, disabled:true},[
      ]],
      'precio':[{value:null, disabled:false},[
      ]],
      'almacenamiento':[{value:null, disabled:false},[
      ]],
      'almacenamiento_mostrar':[{value:null, disabled:true},[
      ]],
      'color':[{value:null, disabled:false},[
      ]],
      'color_mostrar':[{value:null, disabled:true},[
      ]],
      'cantidad':[{value:1, disabled:false},[
      ]],
      'cantidad_mostrar':[{value:null, disabled:true},[
      ]],
      'considerar':[{value:false,disabled:false},[
      ]]
    })
  }

  ListadoSeries(object){
    for (let i in object) {
      this.SeriesProductosForm.get('series')['controls'][i].get('id_producto').setValue(this.data.id_producto);
      this.SeriesProductosForm.get('series')['controls'][i].get('id_serie').setValue(object[i].id_serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('serie').setValue(object[i].serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('serie_mostrar').setValue(object[i].serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('color').setValue(object[i].color);
      this.SeriesProductosForm.get('series')['controls'][i].get('color_mostrar').setValue(object[i].color);
      this.SeriesProductosForm.get('series')['controls'][i].get('almacenamiento').setValue(object[i].almacenamiento);
      this.SeriesProductosForm.get('series')['controls'][i].get('almacenamiento_mostrar').setValue(object[i].almacenamiento);
      this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(this.data.precio);
      this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(1);
      this.SeriesProductosForm.get('series')['controls'][i].get('cantidad_mostrar').setValue(1);
      this.AgregarSerie();
    }
    this.EliminarSerie(Object.keys(object).length)    
  }
  
  AgregarSerie():void{
    this.series = this.SeriesProductosForm.get('series') as FormArray;
    this.series.push(this.CrearSerie())
  };

  EliminarSerie(index){
    this.series.removeAt(index);
  };

  EliminarElemento(array,value){
    // console.log(array,value);
     array.forEach( (item, index) => {
       if(item.id_producto != value) array.splice(index,1);
     });
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie'

@Component({
  selector: 'app-ventanaseriessv',
  templateUrl: './ventanaseriessv.html',
  styleUrls: ['./ventanaseriessv.css'],
  providers:[ServiciosProductoSerie]
})

export class ventanaseriessv  implements OnInit {

  public SeriesProductosForm:FormGroup;
  public series: FormArray;
  public Productos:Array<any>;
  public contador:number=0

  constructor(
     @Inject(MAT_DIALOG_DATA) public data,
      public ventana: MatDialogRef<ventanaseriessv>,
      private FormBuilder: FormBuilder,
      private Series:ServiciosProductoSerie
  ) { }

  ngOnInit() {

    this.SeriesProductosForm = this.FormBuilder.group({
      series: this.FormBuilder.array([this.CrearSerie()])
    })

    if (this.data.series) {
      this.data.series.forEach((item,index)=>{
        if (item.id_producto==this.data.id_producto) {
          this.contador++
        }
      })
      if (this.contador>0) {
        /*Si hay series para el producto, muestra los datos*/
        let i:number=0;
        this.data.series.forEach((item,index)=>{
          if (item.id_producto==this.data.id_producto) {
            this.SeriesProductosForm.get('series')['controls'][i].get('id_producto').setValue(item.id_producto);
            this.SeriesProductosForm.get('series')['controls'][i].get('id_serie').setValue(item.id_serie);
            this.SeriesProductosForm.get('series')['controls'][i].get('serie').setValue(item.serie);
            this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(item.precio);
            this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(item.cantidad);
            this.SeriesProductosForm.get('series')['controls'][i].get('considerar').setValue(item.considerar);
            this.AgregarSerie();
            i++;
          }
        })
        this.EliminarSerie(i)
      }  
      else{
        /*Si no hay series para el producto, trae los datos*/
        this.Series.Listado(this.data.almacen,this.data.id_producto).subscribe(res=>{
          this.ListadoSeries(res);
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
      'precio':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:null, disabled:false},[
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
      this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(this.data.precio);
      this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(object[i].cantidad);
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

  // Guardar(formulario){
  //   formulario.enable();
  //   return formulario.get('series').value;
  // }
}
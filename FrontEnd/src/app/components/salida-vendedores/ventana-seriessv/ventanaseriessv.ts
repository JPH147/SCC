import { Component, OnInit, Inject } from '@angular/core';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';

@Component({
  selector: 'app-ventanaseriessv',
  templateUrl: './ventanaseriessv.html',
  styleUrls: ['./ventanaseriessv.css']
})

export class ventanaseriessv  implements OnInit {

  public SeriesProductosForm:FormGroup;
  public series: FormArray;

  constructor(
     @Inject(MAT_DIALOG_DATA) public data,
      public ventana: MatDialogRef<ventanaseriessv>,
      private FormBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.SeriesProductosForm = this.FormBuilder.group({
      series: this.FormBuilder.array([this.CrearSerie()])
    })

    if (this.data){
      this.ListadoSeries(this.data)
      this.EliminarSerie(Object.keys(this.data.IMEI).length)
    }

  }

  CrearSerie():FormGroup{
    return this.FormBuilder.group({
      'serie':[{value:null, disabled:true},[
      ]],
      'precio':[{value:null, disabled:false},[
      ]],
      'cantidad':[{value:null, disabled:true},[
      ]]
    })
  }

  ListadoSeries(object){
    for (let i in object.IMEI) {
      this.SeriesProductosForm.get('series')['controls'][i].get('serie').setValue(object.IMEI[i].serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(object.precio);
      this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(1)
      this.AgregarSerie();
    }
  }
  
  AgregarSerie():void{
    this.series = this.SeriesProductosForm.get('series') as FormArray;
    this.series.push(this.CrearSerie())
  };

  EliminarSerie(index){
    this.series.removeAt(index);
  };

  Cambio(event){
    console.log(event)
  }
}

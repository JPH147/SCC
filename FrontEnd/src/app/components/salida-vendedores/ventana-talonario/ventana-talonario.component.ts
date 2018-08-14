import { Component, OnInit, Inject } from '@angular/core';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {ServiciosVentas} from '../../global/ventas';

@Component({
  selector: 'app-ventana-talonario',
  templateUrl: './ventana-talonario.component.html',
  styleUrls: ['./ventana-talonario.component.css'],
  providers:[ServiciosVentas]
})
export class VentanaTalonarioComponent implements OnInit {

  public TalonariosForm:FormGroup;
  public talonarios: FormArray;
  public Series: Array<any>;
  public Numeros: Array<any>;

  constructor(
     @Inject(MAT_DIALOG_DATA) public data,
      public ventana: MatDialogRef<VentanaTalonarioComponent>,
      private FormBuilder: FormBuilder,
      private Ventas:ServiciosVentas
  ) { }

  ngOnInit() {
    this.TalonariosForm = this.FormBuilder.group({
      talonarios: this.FormBuilder.array([this.CrearTalonario()])
    })

    this.Ventas.ListarTalonarioSerie().subscribe(res=>
    	this.Series=res
    )

    // if (this.data){
    //   this.ListadoSeries(this.data)
    //   this.EliminarSerie(Object.keys(this.data.IMEI).length)
    // }

  }

  CrearTalonario():FormGroup{
    return this.FormBuilder.group({
      'serie':[{value:null, disabled:false},[
      ]],
      'numero_inicio':[{value:null, disabled:false},[
      ]],
      'numero_fin':[{value:null, disabled:false},[
      ]]
    })
  }

  // ListadoSeries(object){
  //   for (let i in object.IMEI) {
  //     this.SeriesProductosForm.get('talonarios')['controls'][i].get('serie').setValue(object.IMEI[i].serie);
  //     this.SeriesProductosForm.get('talonarios')['controls'][i].get('precio').setValue(object.precio);
  //     this.SeriesProductosForm.get('talonarios')['controls'][i].get('cantidad').setValue(1)
  //     this.AgregarSerie();
  //   }
  // }
  
  AgregarTalonario():void{

    // for (let i in this.Series) {
    //   this.TalonariosForm.get('talonarios')['controls'][i].get('serie').setValue(object.IMEI[i].serie);
    //   this.TalonariosForm.get('talonarios')['controls'][i].get('precio').setValue(object.precio);
    //   this.TalonariosForm.get('talonarios')['controls'][i].get('cantidad').setValue(1);
    // }

    this.talonarios = this.TalonariosForm.get('talonarios') as FormArray;
    this.talonarios.push(this.CrearTalonario())
  };

  EliminarTalonario(index){
    this.talonarios.removeAt(index);
  };

  AgregarNumeros(event){
  	this.Ventas.ListarTalonarioNumero(event.value).subscribe(res=>{
  		this.Numeros=res;
  		console.log(res)
  	})
  }

}
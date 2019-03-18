import { Component, OnInit, Inject } from '@angular/core';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators, AbstractControl} from '@angular/forms';
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
  public Talonarios:Array<any>;

  ListadoTalonario: TalonariosDataSource;
  Columnas: string[] = [ 'numero','serie', 'inicio', 'fin', 'opciones'];

  constructor(
     @Inject(MAT_DIALOG_DATA) public data,
      public ventana: MatDialogRef<VentanaTalonarioComponent>,
      private FormBuilder: FormBuilder,
      private Ventas:ServiciosVentas
  ) { }

  ngOnInit() {

    this.data ? this.Talonarios=this.data : this.Talonarios=[];

    this.ListarTalonarioSerie();

    this.ListadoTalonario = new TalonariosDataSource();
    this.ListadoTalonario.AgregarInformacion(this.data);

    this.TalonariosForm = this.FormBuilder.group({
      'serie':[{value:null, disabled:false},[
        Validators.required,
      ]],
      'numero_inicio':[{value:null, disabled:false},[
        Validators.required,
      ]],
      'numero_fin':[{value:null, disabled:false},[
        Validators.required,
      ]],
      'id_numero_inicio':[{value:null, disabled:false},[
      ]],
      'id_numero_fin':[{value:null, disabled:false},[
      ]]
    })
  }

  MinimoSeleccionado(){
    this.TalonariosForm.get('numero_fin').setValidators([(control: AbstractControl) => Validators.min(this.TalonariosForm.value.numero_inicio)(control)]);
  }
  
  MaximoSeleccionado(){
   this.TalonariosForm.get('numero_inicio').setValidators([(control: AbstractControl) => Validators.max(this.TalonariosForm.value.numero_fin)(control)]);
  }

  ListarTalonarioSerie(){
    this.Ventas.ListarTalonarioSerie().subscribe(res=>{

      if (this.Talonarios.length>0) {
        this.Talonarios.forEach((item)=>{
          // console.log(item)
          this.Series=res.filter(e=>e.serie!=item.serie)
        })
      }else{
        this.Series=res;
      }
    })
  }

  EliminarTalonario(serie){
    this.Talonarios=this.Talonarios.filter(e=>e.serie!=serie);
    this.ListadoTalonario.AgregarInformacion(this.Talonarios);
    this.ListarTalonarioSerie()
  };

  AgregarNumeros(event){
  	this.Ventas.ListarTalonarioNumero(event.value).subscribe(res=>{
  		this.Numeros=res;
  	})
  }

  AgregarTalonario(formulario){
    
    this.Talonarios.push({
      numero:this.Talonarios.length+1,
      serie:formulario.value.serie,
      numero_inicio:formulario.value.numero_inicio.numero,
      numero_fin:formulario.value.numero_fin.numero,
      id_numero_inicio:formulario.value.numero_inicio.id,
      id_numero_fin:formulario.value.numero_fin.id
    })

    this.TalonariosForm.reset();
    this.ListadoTalonario.AgregarInformacion(this.Talonarios);
    this.ListarTalonarioSerie()
  }

}

export class TalonariosDataSource implements DataSource<any> {

  public InformacionTalonarios = new BehaviorSubject<any[]>([]);

  constructor() { }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.InformacionTalonarios.asObservable();
  }

  disconnect(){
    this.InformacionTalonarios.complete();
  }

  AgregarInformacion(array){
    this.InformacionTalonarios.next(array)
  }

}
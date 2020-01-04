import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl, FormGroup, FormBuilder, FormArray,Validators} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie'
import { BehaviorSubject, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ventanaseriessv',
  templateUrl: './ventanaseriessv.html',
  styleUrls: ['./ventanaseriessv.css'],
  providers:[ServiciosProductoSerie]
})

export class ventanaseriessv  implements OnInit {

  @ViewChild('InputBuscador') FiltroBuscador : ElementRef ;
  public Cargando = new BehaviorSubject<boolean>(false);
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
      buscador : ["",[]],
      series: this.FormBuilder.array([this.CrearSerie()])
    })

    if (this.data.series) {
      this.data.series.forEach((item)=>{
        // console.log(item,this.data.id_producto)
        if (item.id_producto==this.data.id_producto) {
          this.contador++
        }
      })
      if (this.contador>0) {
        /*Si hay series para el producto, muestra los datos*/
        let i:number=0;
        this.data.series.forEach((item)=>{
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
        // console.log("Estamos aquí")
        /*Si no hay series para el producto, trae los datos*/
        this.Cargando.next(true);
        this.Series.Listado(this.data.almacen,this.data.id_producto,1,20).subscribe(res=>{
          this.Cargando.next(false);
          // console.log(res['data'].producto_series);
          this.ListadoSeries(res['data'].producto_series);
        })
      }
    }
  }

  ngAfterViewInit(){
    fromEvent( this.FiltroBuscador.nativeElement, 'keyup' )
    .pipe(
      tap(()=>{
        this.FiltrarSeries();
      })
    ).subscribe()
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
        Validators.pattern('[0-9]+'),
        Validators.min(0)
      ]],
      'cantidad':[{value:null, disabled:false},[
      ]],
      'considerar':[{value:false,disabled:false},[
      ]],
      // Solo se usa para filtrar
      'mostrar':[{value:true,disabled:false},[
      ]]
    })
  }

  ListadoSeries(object){
    for (let i in object) {
      this.SeriesProductosForm.get('series')['controls'][i].get('id_producto').setValue(this.data.id_producto);
      this.SeriesProductosForm.get('series')['controls'][i].get('id_serie').setValue(object[i].id_serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('serie').setValue(object[i].serie);
      this.SeriesProductosForm.get('series')['controls'][i].get('precio').setValue(this.data.precio ? this.data.precio : object[i].precio);
      this.SeriesProductosForm.get('series')['controls'][i].get('cantidad').setValue(object[i].cantidad);
      this.AgregarSerie();
    }
    this.EliminarSerie(object.length)    
  }
  
  AgregarSerie():void{
    this.series = this.SeriesProductosForm.get('series') as FormArray;
    this.series.push(this.CrearSerie())
  };

  EliminarSerie(index){
    this.series.removeAt(index);
  };

  FiltrarSeries(){
    let filtro : string = this.FiltroBuscador.nativeElement.value ;
    this.SeriesProductosForm['controls'].series['controls'].forEach(item => {
      let serie : string = item.value.serie.toString() ;
      if( serie.includes(filtro) ) {
        item.get('mostrar').setValue(true)
      } else {
        item.get('mostrar').setValue(false)
      }
    });
  }

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
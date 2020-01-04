import {Component, Inject, OnInit, AfterViewInit, Optional, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';
import {fromEvent} from 'rxjs';
import {debounceTime, tap, distinctUntilChanged} from 'rxjs/operators'

@Component({
  selector: 'app-ventanaemergentetipo',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteTipo {
  
  @ViewChild('InputTipo', { static: true }) FiltroTipo: ElementRef;
  public selectedValue: string;
  public TipoForm: FormGroup;
  public Tipo: Array<any>;
  public lstunidades: any[] = [];
  public mensaje: string;
  public total: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteTipo>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){

    this.TipoForm = this.FormBuilder.group({
      'nombre': [null,[
        Validators.required
      ]],
      'idunidadmedida': [null,[
        Validators.required
      ]]
    })

    this.Servicios.ListarUnidadMedida('').subscribe(res=>{
      let unidades = res['data'].unidades;
      for(let i in unidades){
        this.lstunidades.push(unidades[i])
      }
    });

    if(this.data){
      this.TipoForm.get('nombre').setValue(this.data.nombre);
      this.TipoForm.get('idunidadmedida').setValue(this.data.idunidad);
    }

  }  

  ngAfterViewInit(){
    fromEvent(this.FiltroTipo.nativeElement,'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        // console.log("holaa")
        this.Servicios.ListarTipoProductos2(null,this.FiltroTipo.nativeElement.value.trim(),"",1,1).subscribe(res=>{
          // console.log(res)
          if (res) {
            this.total=res['data'].tipo_productos.length;
            // console.log(this.total)
            // console.log("hola")
          }else{
            this.total=0
          }
        })
      })
    ).subscribe()
  }

  Guardar(formulario){

    if(this.data){
      if (this.data.productos) {
        this.mensaje='Tipo de Producto creado satisfactoriamente';
        this.Servicios.CrearTipoProducto(formulario.value.nombre, formulario.value.idunidadmedida).subscribe(res=>{
          this.ventana.close()
        });
      } else {
        this.mensaje='Datos actualizados satisfactoriamente';
        this.Servicios.EditarTipoProducto(this.data.id,formulario.value.nombre, formulario.value.idunidadmedida).subscribe(res=>{
          this.ventana.close()
        });
      }
    }

    if(!this.data){
      this.mensaje='Tipo de Producto creado satisfactoriamente';
      this.Servicios.CrearTipoProducto(formulario.value.nombre, formulario.value.idunidadmedida).subscribe(res=>{
        this.ventana.close(res['data']);
      });
    }
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

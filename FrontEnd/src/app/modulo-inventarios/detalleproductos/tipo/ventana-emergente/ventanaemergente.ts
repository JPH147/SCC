import {Component, Inject, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
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
  public total: number = 0;

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
      'nombre_anterior': ["",[
      ]],
      'nombre': [null,[
        Validators.required
      ]],
      'tiene_serie': [true,[
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
      this.TipoForm.get('nombre_anterior').setValue(this.data.nombre);
      this.TipoForm.get('idunidadmedida').setValue(this.data.idunidad);
      if ( this.data.tiene_serie == 1 ) {
        this.TipoForm.get('tiene_serie').setValue(true);
      } else {
        this.TipoForm.get('tiene_serie').setValue(false);
      }
    }

  }  

  ngAfterViewInit(){
    fromEvent(this.FiltroTipo.nativeElement,'keyup')
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        this.Servicios.ListarTipoProductos2(null,this.FiltroTipo.nativeElement.value.trim(),"",1,1).subscribe(res=>{
          let arrayValidado : Array<any> ;
          if( res ) {
            if ( this.TipoForm.get('nombre_anterior').value ) {
              arrayValidado = res['data'].tipo_productos.filter( elemento => elemento.nombre != this.TipoForm.get('nombre_anterior').value ) ;
            } else {
              arrayValidado = res['data'].tipo_productos ;
            }
            arrayValidado = res['data'].tipo_productos.filter( elemento => elemento.nombre == this.TipoForm.get('nombre').value ) ;
            if ( res['data'].tipo_productos ) {
              this.total=arrayValidado.length;
            }else{
              this.total=0
            }
          } else{
            this.total=0
          }
        })
      })
    ).subscribe()
  }

  Guardar(formulario){

    let tiene_serie : number = this.TipoForm.get('tiene_serie').value ? 1 : 2 ;
    if(this.data){
      if (this.data.productos) {
        this.mensaje='Tipo de Producto creado satisfactoriamente';
        this.Servicios.CrearTipoProducto(formulario.value.nombre, tiene_serie, formulario.value.idunidadmedida).subscribe(res=>{
          this.ventana.close()
        });
      } else {
        this.mensaje='Datos actualizados satisfactoriamente';
        this.Servicios.EditarTipoProducto(this.data.id,formulario.value.nombre, tiene_serie, formulario.value.idunidadmedida).subscribe(res=>{
          this.ventana.close()
        });
      }
    }

    if(!this.data){
      this.mensaje='Tipo de Producto creado satisfactoriamente';
      this.Servicios.CrearTipoProducto(formulario.value.nombre, tiene_serie, formulario.value.idunidadmedida).subscribe(res=>{
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

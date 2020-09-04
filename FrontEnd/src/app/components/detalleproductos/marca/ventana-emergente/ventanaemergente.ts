import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';
import {fromEvent,merge} from 'rxjs';
import {debounceTime, tap, distinctUntilChanged} from 'rxjs/operators'

@Component({
  selector: 'app-ventanaemergentemarca',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteMarca {

  @ViewChild('InputMarca', { static: true }) FiltroMarca: ElementRef;
  @ViewChild('InputTipo', { static: true }) FiltroTipo: MatSelect;
  public selectedValue: string;
  public MarcaForm: FormGroup;
  public Tipo: Array<any>;
  public lsttipos: Array<any>= [];
  public mensaje: string;
  public total: number;
  public producto_seleccionado: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteMarca>,
    // tslint:disable-next-line:no-shadowed-variable
    private FormBuilder: FormBuilder,
    private Servicios: ServiciosGenerales,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.MarcaForm = this.FormBuilder.group({
      'nombre_anterior': [null, [
      ]],
      'nombre': [null, [
        Validators.required
      ]],
      'idtipo': [null, [
        Validators.required
      ]]
    });

    
    this.Servicios.ListarTipoProductos(null,'', '').subscribe(res=>{
      this.lsttipos = res;
      if (this.data) {
        if (this.data.productos) {
          this.Servicios.ListarTipoProductos(this.data.productos.id_tipo,"","").subscribe(rest=>{
            this.MarcaForm.get('idtipo').setValue(this.data.productos.id_tipo);
            this.ObtenerArreglo();
          })
        } else {
          this.MarcaForm.get('nombre_anterior').setValue(this.data.nombre);
          this.MarcaForm.get('nombre').setValue(this.data.nombre);
          this.MarcaForm.get('idtipo').setValue(this.data.id_tipo);
          this.Servicios.ListarTipoProductos(this.data.id_tipo,"","").subscribe(rest=>{
            this.ObtenerArreglo();
          })
        }
      }
    });
  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroMarca.nativeElement,'keyup'),
      this.FiltroTipo.selectionChange
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (this.producto_seleccionado) {
          let arrayValidado : Array<any> ;
          this.Servicios.ListarMarca(this.MarcaForm.value.idtipo,this.FiltroMarca.nativeElement.value.trim()).subscribe(res=>{
            if ( this.MarcaForm.get('nombre_anterior').value ) {
              arrayValidado = res.filter( elemento => elemento.nombre != this.MarcaForm.get('nombre_anterior').value ) ;
            } else {
              arrayValidado = res ;
            }
            arrayValidado = res.filter( elemento => elemento.nombre == this.MarcaForm.get('nombre').value ) ;
            if (res) {
              this.total=arrayValidado.length;
            }else{
              this.total=0
            }
          })
        }
      })
    ).subscribe()
  }

  ObtenerArreglo(){
    if ( this.lsttipos.filter(e=>e.id==this.MarcaForm.value.idtipo)[0] ) {
      this.producto_seleccionado = this.lsttipos.filter(e=>e.id==this.MarcaForm.value.idtipo)[0].nombre;
    }
  }

  Guardar(formulario) {
    if (this.data) {
      if (this.data.productos) {
        this.mensaje = 'Marca creada satisfactoriamente';
        this.Servicios.CrearMarca(formulario.value.idtipo, formulario.value.nombre).subscribe(res=>{
          this.ventana.close(res['data']);
        });
      } else {
        this.mensaje = 'Datos actualizados satisfactoriamente';
        this.Servicios.EditarMarca(this.data.id, formulario.value.idtipo, formulario.value.nombre).subscribe(res=>{
          this.ventana.close()
        });
      }
    }

    if (!this.data) {
      this.mensaje = 'Marca creada satisfactoriamente';
      this.Servicios.CrearMarca(formulario.value.idtipo, formulario.value.nombre).subscribe(res=>{
        this.ventana.close()
      });
    }
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

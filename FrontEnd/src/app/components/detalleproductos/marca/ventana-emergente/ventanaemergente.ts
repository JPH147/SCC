import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar, MatSelect} from '@angular/material';
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
          this.MarcaForm.get('nombre').setValue(this.data.marca);
          this.Servicios.ListarTipoProductos(this.data.idtipo,"","").subscribe(rest=>{
            this.MarcaForm.get('idtipo').setValue(this.data.idtipo);
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
          this.Servicios.ListarMarca2(this.producto_seleccionado,this.FiltroMarca.nativeElement.value.trim(),1,1).subscribe(res=>{
            // console.log(res)
            if (res) {
              this.total=res['data'].marca.length;
            }else{
              this.total=0
            }
          })
        }
      })
    ).subscribe()
  }

  ObtenerArreglo(){
    this.producto_seleccionado = this.lsttipos.filter(e=>e.id==this.MarcaForm.value.idtipo)[0].nombre;
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

import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar, MatSelect} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';
import {fromEvent,merge} from 'rxjs';
import {debounceTime, tap, distinctUntilChanged} from 'rxjs/operators'

@Component({
  selector: 'app-ventanaemergentemodelo',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteModelo {

  @ViewChild ('InputModelo') FiltroModelo: ElementRef;
  @ViewChild('InputMarca') FiltroMarca: MatSelect;
  public selectedValue: string;
  public ModeloForm: FormGroup;
  public Tipo: Array<any>;
  public lstmarcas: any[] = [];
  public mensaje: string;
  public total:number;
  public marca_seleccionada: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteModelo>,
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
    this.ModeloForm = this.FormBuilder.group({
      'nombre': [null, [
        Validators.required
      ]],
      'idmarca': [null, [
        Validators.required
      ]]
    });

    this.Servicios.ListarMarca('', '').subscribe(res=>{
      this.lstmarcas = res;
    });

    if (this.data) {
       if (this.data.productos) {
         // console.log(this.data.productos)
        this.ModeloForm.get('idmarca').setValue(this.data.productos.id_marca);
       }else{
        this.ModeloForm.get('nombre').setValue(this.data.modelo);
        this.ModeloForm.get('idmarca').setValue(this.data.id_marca);
       }
    }
  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroModelo.nativeElement,'keyup'),
      this.FiltroMarca.selectionChange
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (this.ModeloForm.value.idmarca) {
          this.Servicios.ListarModelo(this.ModeloForm.value.idmarca,this.FiltroModelo.nativeElement.value.trim()).subscribe(res=>{
            // console.log(res);
            if (res) {
              this.total=res.length;
            }else{
              this.total=0
            }
          })
        }
      })
    ).subscribe()
  }

  ObtenerArreglo(){
    this.marca_seleccionada = this.lstmarcas.filter(e=>e.id==this.ModeloForm.value.idmarca)[0].nombre;
  }

  Guardar(formulario) {
    if (this.data) {
      if (this.data.productos) {
        this.mensaje = 'Modelo creado satisfactoriamente';
        this.Servicios.CrearModelo(formulario.value.idmarca, formulario.value.nombre).subscribe();
      } else {
        this.mensaje = 'Datos actualizados satisfactoriamente';
        this.Servicios.EditarModelo(this.data.id, formulario.value.idmarca, formulario.value.nombre).subscribe();
      }
    }

    if (!this.data) {
      this.mensaje = 'Modelo creado satisfactoriamente';
      this.Servicios.CrearModelo(formulario.value.idmarca, formulario.value.nombre).subscribe();
    }
      this.ModeloForm.reset();
      this.ventana.close();
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

import {Component, Inject, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import {BehaviorSubject, fromEvent,merge} from 'rxjs';
import {debounceTime, tap, distinctUntilChanged, finalize} from 'rxjs/operators'

@Component({
  selector: 'app-ventanaemergentemodelo',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteModelo {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  @ViewChild('InputModelo', { static: true }) FiltroModelo: ElementRef;
  @ViewChild('InputMarca', { static: true }) FiltroMarca: MatSelect;
  public selectedValue: string;
  public ModeloForm: FormGroup;
  public Tipos: Array<any>;
  public Marcas: any[] = [];
  public mensaje: string;
  public total:number;
  public marca_seleccionada: string;
  public tipo:number;

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
      'nombre_anterior': [ {value:null, disabled: false}, [
      ]],
      'nombre': [ {value:null, disabled: true}, [
        Validators.required
      ]],
      'idmarca': [ {value:null, disabled: true}, [
        Validators.required
      ]],
      'id_tipo': [ {value:null, disabled: false}, [
        Validators.required
      ]],
    });

    // this.Servicios.ListarMarca('', '').subscribe(res=>{
    //   this.Marcas = res;
    // });

    this.ListarTipos();

    if (this.data) {

      this.ModeloForm.get('nombre').enable();
      this.ModeloForm.get('idmarca').enable();

      if (this.data.productos) {
        
        this.Servicios.SeleccionarMarca(this.data.productos.id_marca).subscribe(res=>{
          this.ModeloForm.get('id_tipo').setValue(res['id_tipo']);
          this.ListarMarcas(res['id_tipo']);
          this.ModeloForm.get('idmarca').setValue(this.data.productos.id_marca);
        })

      }else{
        this.ModeloForm.get('nombre_anterior').setValue(this.data.modelo);
        this.ModeloForm.get('nombre').setValue(this.data.modelo);
        this.Servicios.SeleccionarMarca(this.data.id_marca).subscribe(res=>{
          this.ModeloForm.get('id_tipo').setValue(res['id_tipo']);
          this.ListarMarcas(res['id_tipo']);
          this.ModeloForm.get('idmarca').setValue(this.data.id_marca);
        })
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
          let arrayValidado : Array<any> ;
          this.Servicios.ListarModelo(this.ModeloForm.value.idmarca,this.FiltroModelo.nativeElement.value.trim()).subscribe(res=>{
            if ( this.ModeloForm.get('nombre_anterior').value ) {
              arrayValidado = res.filter( elemento => elemento.nombre != this.ModeloForm.get('nombre_anterior').value ) ;
            } else {
              arrayValidado = res ;
            }
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
    this.marca_seleccionada = this.Marcas.filter(e=>e.id==this.ModeloForm.value.idmarca)[0].nombre;
  }

  /*****************************************************************************/
  TipoSeleccionado(event) {
    this.ListarMarcas(event.value);
    this.ModeloForm.get('idmarca').setValue('');
    this.ModeloForm.get('nombre').setValue('');
    this.ModeloForm.controls['idmarca'].enable();
    this.ModeloForm.controls['nombre'].disable();
  }

  MarcaSeleccionada(){
    this.ModeloForm.get('nombre').setValue('');
    this.ModeloForm.controls['nombre'].enable();
  }

  ListarTipos(){
    this.Servicios.ListarTipoProductos(null,'', '').subscribe(res => {
      this.Marcas = [];
      this.Tipos=res
    })}

  ListarMarcas(i) {
    this.Servicios.ListarMarca(i, '').subscribe(res => {
      this.Marcas = res;
  })}

  /*****************************************************************************/

  Guardar(formulario) {
    if (this.data) {
      if (this.data.productos) {
        this.Servicios.CrearModelo(formulario.value.idmarca, formulario.value.nombre)
        .pipe(finalize(()=>this.Cargando.next(false)))
        .subscribe(res=>{
          this.mensaje = 'Modelo creado satisfactoriamente';
          this.ventana.close(res['data']);
        });
      } else {
        this.Servicios.EditarModelo(this.data.id, formulario.value.idmarca, formulario.value.nombre)
        .pipe(finalize(()=>this.Cargando.next(false)))
        .subscribe(res=>{
          this.mensaje = 'Datos actualizados satisfactoriamente';
          this.ventana.close()
        });
      }
    }

    if (!this.data) {
      this.Servicios.CrearModelo(formulario.value.idmarca, formulario.value.nombre)
      .pipe(finalize(()=>this.Cargando.next(false)))
      .subscribe(res=>{
        this.mensaje = 'Modelo creado satisfactoriamente';
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

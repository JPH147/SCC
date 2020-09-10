import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ServiciosVentas } from 'src/app/core/servicios/ventas';
import { BehaviorSubject} from 'rxjs';
import { finalize} from 'rxjs/operators';

@Component({
  selector: 'app-ventana-vendedor',
  templateUrl: './ventana-vendedor.html',
  styleUrls: ['./ventana-vendedor.css'],
  providers: [ServiciosVentas]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaVendedorComponent {
  public Cargando = new BehaviorSubject<boolean>(false) ;
  public VendedoresForm : FormGroup ;
  public Cargos : Array<any> ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaVendedorComponent>,
    private Builder: FormBuilder,
    private Servicios: ServiciosVentas,
  ) {}

  ngOnInit() {
    this.CrearFormulario();
    this.ListarCargos()

    if(this.data){
      this.AsignarValores();
    }
  }

  ngAfterViewInit(){
  }

  CrearFormulario(){
    this.VendedoresForm = this.Builder.group({
      'id': [null, [
      ]],
      'documento': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'nombre': [{value: "", disabled: false}, [
        Validators.required
      ]],
      'cargo': [{value: 1, disabled: false}, [
        Validators.required
      ]],
      'email': ["", [
        Validators.required,
      ]],
      'comision': [10, [
        Validators.required,
        Validators.pattern ('[0-9- ]+')
      ]],
    });
  }

  AsignarValores(){
    this.VendedoresForm.get('id').setValue(this.data.vendedor.id)
    this.VendedoresForm.get('documento').setValue(this.data.vendedor.dni)
    this.VendedoresForm.get('nombre').setValue(this.data.vendedor.nombre)
    this.VendedoresForm.get('cargo').setValue(this.data.vendedor.id_cargo)
    this.VendedoresForm.get('email').setValue(this.data.vendedor.email)
    this.VendedoresForm.get('comision').setValue(this.data.vendedor.comision)
  }

  ListarCargos(){
    this.Servicios.ListarVendedorCargo("",1,50).subscribe(res=>{
      this.Cargos = res['data']
    })
  }

  CambioCargo(){
    if( this.VendedoresForm.value.cargo == 1 ) {

    } else {
      this.VendedoresForm.get('comision').setValue(0) ;
    }
  }

  Guardar(){
    if( !this.data ){
      this.CrearVendedor()
    } else {
      this.ActualizarVendedor()
    }
  }

  CrearVendedor(){
    this.Cargando.next(true) ;
    this.Servicios.CrearVendedor(
      this.VendedoresForm.value.documento,
      this.VendedoresForm.value.nombre,
      this.VendedoresForm.value.cargo,
      this.VendedoresForm.value.email,
      this.VendedoresForm.value.comision
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }

  ActualizarVendedor(){
    this.Servicios.ActualizarVendedor(
      this.VendedoresForm.value.id,
      this.VendedoresForm.value.documento,
      this.VendedoresForm.value.nombre,
      this.VendedoresForm.value.cargo,
      this.VendedoresForm.value.email,
      this.VendedoresForm.value.comision
    )
    .pipe(
      finalize(()=>this.Cargando.next(false))
    )
    .subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true)
      }else{
        this.ventana.close(false)
      }
    })
  }
}

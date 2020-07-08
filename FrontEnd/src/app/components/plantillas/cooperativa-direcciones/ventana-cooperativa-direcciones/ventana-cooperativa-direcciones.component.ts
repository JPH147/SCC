import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosDirecciones } from '../../../global/direcciones';
import { CooperativaConfiguracionService } from '../../../cooperativa-configuracion/cooperativa-configuracion.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ventana-cooperativa-direcciones',
  templateUrl: './ventana-cooperativa-direcciones.component.html',
  styleUrls: ['./ventana-cooperativa-direcciones.component.css']
})
export class VentanaCooperativaDireccionesComponent implements OnInit {

  public Cargando = new BehaviorSubject<boolean>(false) ;
  
  public DireccionesForm : FormGroup ;
  public Tipos : Array<any> ;
  public LstDepartamento: Array<any>;
  public LstProvincia: Array<any>;
  public LstDistrito: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaCooperativaDireccionesComponent> ,
    private _builder : FormBuilder ,
    private _direcciones : ServiciosDirecciones ,
    private _cooperativa : CooperativaConfiguracionService
  ) { }

  ngOnInit() {
    this.CrearFormulario() ;
    
    // console.log(this.data) ;

    if( this.data ) {
      this.DireccionesForm.get('id_direccion').setValue(this.data.id_cooperativa_direccion) ;
      this.DireccionesForm.get('direccion').setValue(this.data.cooperativa_direccion) ;
      this.DireccionesForm.get('departamento').setValue(this.data.departamento) ;
      this.DireccionesForm.get('provincia').setValue(this.data.provincia) ;
      this.DireccionesForm.get('distrito').setValue(this.data.id_distrito) ;
    }
    
    this.ListarDepartamento();
    this.ListarProvincia();
    this.ListarDistrito();
  }

  CrearFormulario(){
    this.DireccionesForm = this._builder.group({
      id_direccion : [{ value: null, disabled : false }, [
        Validators.required
      ]] ,
      direccion: [null,[
        Validators.required
      ]],
      departamento: [null,[
        Validators.required
      ]],
      provincia: [null,[
        Validators.required
      ]],
      distrito: [null,[
        Validators.required
      ]],
    })
  }
  
  ListarDepartamento() {
    this._direcciones.ListarDepartamentos('', 1, 50).subscribe( res => {
      this.LstDepartamento = res['data'].departamentos;
    });
  }

  ListarProvincia() {
    this._direcciones.ListarProvincias(this.DireccionesForm.get('departamento').value, '' , 1, 30).subscribe( res => {
      this.LstProvincia = res['data'].provincias;
    });
  }

  ListarDistrito() {
    this._direcciones.ListarDistritos(this.DireccionesForm.get('departamento').value, this.DireccionesForm.get('provincia').value , '', 1, 50).subscribe( res => {
      this.LstDistrito = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado() {
    this._direcciones.ListarProvincias(this.DireccionesForm.get('departamento').value, '' , 1, 30).subscribe(res => {
      this.LstProvincia = res['data'].provincias
    });
    this.DireccionesForm.get('provincia').setValue('');
    this.DireccionesForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada() {
    this._direcciones.ListarDistritos(this.DireccionesForm.get('departamento').value,this.DireccionesForm.get('provincia').value , '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.DireccionesForm.get('distrito').setValue('');
  }

  Guardar(){
    this.Cargando.next(true) ;

    this._cooperativa.ActualizarDireccion(
      this.DireccionesForm.get('id_direccion').value ,
      this.DireccionesForm.get('distrito').value ,
      this.DireccionesForm.get('direccion').value ,
    ).subscribe(res=>{
      this.Cargando.next(false) ;
      this.ventana.close(res) ;
    }) ;
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiciosDirecciones } from 'src/app/core/servicios/direcciones';

@Component({
  selector: 'app-ventana-editar-direccion',
  templateUrl: './ventana-editar-direccion.component.html',
  styleUrls: ['./ventana-editar-direccion.component.css']
})
export class VentanaEditarDireccionComponent implements OnInit {

  public DireccionesForm : FormGroup ;
  public Tipos : Array<any> ;
  public LstDepartamento: Array<any>;
  public LstProvincia: Array<any>;
  public LstDistrito: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any ,
    private ventana : MatDialogRef<VentanaEditarDireccionComponent> ,
    private _builder : FormBuilder ,
    private _direcciones : ServiciosDirecciones
  ) { }

  ngOnInit() {
    this.CrearFromulario() ;
    
    if( this.data ) {
      this.DireccionesForm.get('id_direccion').setValue(this.data.direccion.id) ;
      this.DireccionesForm.get('direccion').setValue(this.data.direccion.direccion) ;
      this.DireccionesForm.get('departamento').setValue(this.data.direccion.departamento) ;
      this.DireccionesForm.get('provincia').setValue(this.data.direccion.provincia) ;
      this.DireccionesForm.get('distrito').setValue(this.data.direccion.id_distrito) ;
      this.DireccionesForm.get('referencia').setValue(this.data.direccion.referencia) ;
    }
    
    this.ListarDepartamento();
    this.ListarProvincia();
    this.ListarDistrito();
  }

  CrearFromulario(){
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
      referencia: ['',[
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
    this._direcciones.ListarDistritos('', this.DireccionesForm.get('provincia').value , '', 1, 50).subscribe( res => {
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
    this._direcciones.ListarDistritos('',this.DireccionesForm.get('provincia').value , '' , 1, 50).subscribe(res => {
      this.LstDistrito = res['data'].distritos
    });
    this.DireccionesForm.get('distrito').setValue('');
  }

  Guardar(){
    this._direcciones.ActualizarDireccion(
      this.DireccionesForm.get('id_direccion').value ,
      this.DireccionesForm.get('direccion').value ,
      this.DireccionesForm.get('distrito').value ,
      this.DireccionesForm.get('referencia').value ,
    ).subscribe(res=>{
      this.ventana.close(res)
    }) ;
  }
}

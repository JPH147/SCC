import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder,Validators} from '@angular/forms';
import { ServiciosDirecciones, Departamento, Provincia } from 'src/app/core/servicios/direcciones'
import { CentrosTrabajoService } from '../../centros-trabajo.service';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ventana-centro-trabajo-pnp',
  templateUrl: './ventana-centro-trabajo-pnp.component.html',
  styleUrls: ['./ventana-centro-trabajo-pnp.component.css']
})
export class VentanaCentroTrabajoPnpComponent implements OnInit {  

  public Cargando = new BehaviorSubject<boolean>(false) ;
  public CentroTrabajoForm: FormGroup;
  
  public Departamentos : Array<any> = [] ;
  public Provincias : Array<any> = [] ;
  public Distritos : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaCentroTrabajoPnpComponent>,
    private FormBuilder: FormBuilder,
    private ServicioDireccion: ServiciosDirecciones,
    private _centrosTrabajo : CentrosTrabajoService ,
    public snackBar: MatSnackBar
    ) {}

  onNoClick(): void {
    this.ventana.close();
  }

  ngOnInit(){
    this.ListarDepartamento() ;

    this.CentroTrabajoForm = this.FormBuilder.group({
      'departamento': [null,[
        Validators.required
      ]],
      'provincia': [{value:null, disabled:false},[
        Validators.required
      ]],
      'distrito': [null,[
        Validators.required
      ]],
      'comisaria': [null,[
        Validators.required
      ]],
      'division': [null,[
        Validators.required
      ]],
      'telefono': [null,[
        Validators.required
      ]],
      'direccion': [null,[
        Validators.required
      ]]
    })

    if(this.data){
      console.log(this.data) ;
      this.CentroTrabajoForm.get('departamento').setValue(this.data.departamento);
      this.CentroTrabajoForm.get('provincia').setValue(this.data.provincia);
      if ( this.data.id_distrito > 0 ) {
        this.ListarProvincia(this.data.departamento);
        this.ListarDistrito(this.data.provincia);
      }
      this.CentroTrabajoForm.get('distrito').setValue(this.data.id_distrito) ;
      this.CentroTrabajoForm.get('comisaria').setValue(this.data.comisaria) ;
      this.CentroTrabajoForm.get('division').setValue(this.data.division) ;
      this.CentroTrabajoForm.get('telefono').setValue(this.data.telefono) ;
      this.CentroTrabajoForm.get('direccion').setValue(this.data.direccion) ;
    }

  }  

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ListarDepartamento() {
    this.ServicioDireccion.ListarDepartamentos('', 0, 50).subscribe( res => {
      this.Departamentos = res['data'].departamentos;
    });
  }

  ListarProvincia(i) {
    this.ServicioDireccion.ListarProvincias(i, '' , 0, 30).subscribe( res => {
      this.Provincias = res['data'].provincias;
    });
  }

  ListarDistrito(i) {
    this.ServicioDireccion.ListarDistritos('', i , '', 0, 50).subscribe( res => {
      this.Distritos = res['data'].distritos;
    });
  }

  DepartamentoSeleccionado(event) {
    this.ListarProvincia(event.value);
    this.Distritos=[];
    this.CentroTrabajoForm.get('provincia').setValue('');
    this.CentroTrabajoForm.get('distrito').setValue('');
  }

  ProvinciaSeleccionada(event) {
    this.ListarDistrito(event.value)
    this.CentroTrabajoForm.get('distrito').setValue('');
  }


  Guardar(){
    this.Cargando.next(true) ;

    if(this.data){
      this._centrosTrabajo.ActualizarCentroTrabajo(
        this.data.id_centro_trabajo_pnp,
        this.CentroTrabajoForm.get('distrito').value ,
        this.CentroTrabajoForm.get('comisaria').value ,
        this.CentroTrabajoForm.get('division').value ,
        this.CentroTrabajoForm.get('telefono').value ,
        this.CentroTrabajoForm.get('direccion').value ,
      )
      .pipe(
        finalize(()=> {
          this.Cargando.next(false) ;
        })
      )
      .subscribe(res=>{
        // console.log(res) ;
        if(res['codigo']==0){
          this.Notificacion("Se actualizó el centro de trabajo satisfactoriamente","")
          this.ventana.close() ;
        } else {
          this.Notificacion("Ocurrió un error al actualizar el centro de trabajo","")
        }
      })
    }

    if(!this.data){
      this._centrosTrabajo.CrearCentroTrabajo(
        this.CentroTrabajoForm.get('distrito').value ,
        this.CentroTrabajoForm.get('comisaria').value ,
        this.CentroTrabajoForm.get('division').value ,
        this.CentroTrabajoForm.get('telefono').value ,
        this.CentroTrabajoForm.get('direccion').value ,
      )
      .pipe(
        finalize(()=> {
          this.Cargando.next(false) ;
        })
      )
      .subscribe(res=>{
        if(res['codigo']==0){
          this.Notificacion("Se creo el centro de trabajo satisfactoriamente","")
          this.ventana.close() ;
        } else {
          this.Notificacion("Ocurrió un error al crear el centro de trabajo","")
        }
      }) ;
    }
  }
}

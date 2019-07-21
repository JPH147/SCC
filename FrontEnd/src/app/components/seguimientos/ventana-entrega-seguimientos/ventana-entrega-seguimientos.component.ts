import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { SeguimientosService } from '../seguimientos.service';

@Component({
  selector: 'app-ventana-entrega-seguimientos',
  templateUrl: './ventana-entrega-seguimientos.component.html',
  styleUrls: ['./ventana-entrega-seguimientos.component.css'],
})
export class VentanaEntregaSeguimientosComponent implements OnInit {

  public VentanaRegistroSeguimientoForm : FormGroup ;
  public Couriers : Array<any>;
  public editar_foto : boolean = false ;
  public hay_foto : boolean = false ;
  public ruta : string ;
  public foto_nuevo : string ;
  public foto_antiguo : string ;
  public foto : string ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    public ventana: MatDialogRef<VentanaEntregaSeguimientosComponent> ,
    private Builder : FormBuilder ,
    private Servicio: SeguimientosService
  ) { }

  ngOnInit() {
    this.CrearFormulario();
  }

  CrearFormulario(){
    this.VentanaRegistroSeguimientoForm = this.Builder.group({
      fecha : [ { value : new Date() , disabled : false }, [
        Validators.required
      ] ],
      usuario : [ { value : null , disabled : false }, [
        Validators.required
      ] ],
    })
  }

  Guardar(){

    this.Servicio.RegistrarEntrega(
      this.data,
      this.VentanaRegistroSeguimientoForm.value.fecha,
      this.VentanaRegistroSeguimientoForm.value.usuario,
    ).subscribe(res=>{
      if(res['codigo']==0){
        this.ventana.close(true);
      } else {
        this.ventana.close(false);
      }
    })

  }
}

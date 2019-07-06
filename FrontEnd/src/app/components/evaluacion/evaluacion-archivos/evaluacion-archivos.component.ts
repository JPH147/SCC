import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EvaluacionService } from '../evaluacion.service';
import {ServiciosDirecciones} from '../../global/direcciones';
import * as moment from 'moment';

@Component({
  selector: 'app-evaluacion-archivos',
  templateUrl: './evaluacion-archivos.component.html',
  styleUrls: ['./evaluacion-archivos.component.css'],
  providers : [ EvaluacionService , ServiciosDirecciones ]
})
export class EvaluacionArchivosComponent implements OnInit {

	@Input() informacion_venta: Observable<any>;
  public EvaluacionArchivosForm : FormGroup;

  constructor(
    private Builder : FormBuilder,
    private Servicios : EvaluacionService,
    private DServicios : ServiciosDirecciones
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.CrearFormulario();
    this.ActualizarInformacion();
  }

  CrearFormulario(){
    this.EvaluacionArchivosForm = this.Builder.group({
      nombre_plantilla : [ { value : null , disabled : false } , [
      ]],
      nombre : [ { value : null , disabled : false } , [
      ]],
      dni : [ { value : null , disabled : false } , [
      ]],
      cip : [ { value : null , disabled : false } , [
      ]],
      codigo : [ { value : null , disabled : false } , [
      ]],
      cargo : [ { value : null , disabled : false } , [
      ]],
      email : [ { value : null , disabled : false } , [
      ]],
      subsede : [ { value : null , disabled : false } , [
      ]],
      monto_asociado : [ { value : null , disabled : false } , [
      ]],
      monto_cuota : [ { value : null , disabled : false } , [
      ]],
      numero_cuotas : [ { value : null , disabled : false } , [
      ]],
      direccion : [ { value : null , disabled : false } , [
      ]],
      fecha_letras : [ { value : null , disabled : false } , [
      ]],
      lugar : [ { value : null , disabled : false } , [
        Validators.required
      ]],
    })
  }

  ActualizarInformacion(){
    this.informacion_venta.subscribe(res=>{
      console.log(res);
      if(res.cliente){
        if(res.cliente.id) this.ObtenerDireccion(res.cliente.id);
        this.EvaluacionArchivosForm.get('nombre_plantilla').setValue(res.cliente.plantilla_ddjj)
        this.EvaluacionArchivosForm.get('nombre').setValue(res.cliente.nombre)
        this.EvaluacionArchivosForm.get('dni').setValue(res.cliente.dni)
        this.EvaluacionArchivosForm.get('cip').setValue(res.cliente.cip)
        this.EvaluacionArchivosForm.get('codigo').setValue(res.cliente.codigo)
        this.EvaluacionArchivosForm.get('email').setValue(res.cliente.email)
        this.EvaluacionArchivosForm.get('subsede').setValue(res.cliente.subsede)
        this.EvaluacionArchivosForm.get('fecha_letras').setValue(res.fecha)
        this.EvaluacionArchivosForm.get('cargo').setValue(res.cargo_nombre + " " +res.cargo_estado);
      }
    })
  }

  ObtenerDireccion(id) {
    this.DServicios.ListarDireccion( id, '1',1,1).subscribe(res => {
      console.log(res)
      if (res['data']) {
        this.EvaluacionArchivosForm.get('direccion').setValue(
          res['data'].direcciones[0].direccion + " " +
          "en la provincia de" + " " +
          res['data'].direcciones[0].provincia + " " +
          ", distrito de" + " " +
          res['data'].direcciones[0].distrito + " " +
          ", departamento de" + " " +
          res['data'].direcciones[0].departamento
        );
      }else{
        this.EvaluacionArchivosForm.get('direccion').setValue("No registra")
      }
    });
  }

  GenerarArchivos(){
    let random = (new Date()).getTime();
    this.GenerarDDJJ(random);
  }

  GenerarAutorizacion(nombre_archivo){

  }

  GenerarDDJJ(nombre_archivo){
    this.Servicios.GenerarDDJJ(
      this.EvaluacionArchivosForm.value.nombre_plantilla,
      nombre_archivo.toString(),
      this.EvaluacionArchivosForm.value.nombre,
      this.EvaluacionArchivosForm.value.dni,
      this.EvaluacionArchivosForm.value.direccion,
      this.EvaluacionArchivosForm.value.lugar,
      this.EvaluacionArchivosForm.value.fecha_letras
    ).subscribe(res=>{
      console.log(res)
    })
  }

}

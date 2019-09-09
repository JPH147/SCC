import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { CobranzasService } from '../cobranzas-listar/cobranzas.service';
import { ServiciosGenerales } from '../global/servicios';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranza-archivos.component.html',
  styleUrls: ['./cobranza-archivos.component.css'],
  providers: [ServiciosGenerales]
})
export class CobranzaArchivosComponent implements OnInit {

  // public fecha_inicio= new Date(moment().format("YYYY-MM-01"));
  // public fecha_fin= new Date(moment().format("YYYY-MM-") + moment().daysInMonth());

  public fecha_inicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  public fecha_fin = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  public CobranzaForm: FormGroup;
  public institucion: number;
  public sede: number;
  public Institucion : Array<any>;
  public Sede: Array<any>;

  constructor(
    private location: Location,
    private FormBuilder: FormBuilder,
    private Servicio: CobranzasService,
    private GServicios: ServiciosGenerales,
  ) { }

  ngOnInit() {

    this.CrearFormulario();

    this.GServicios.ListarInstitucion().subscribe(res=>{
      this.Institucion=res;
      for (let i in res) {
        this.Institucion.push(res[i]);
      }
console.log(this.Institucion)
    })
  }

  Atras(){
    this.location.back()
  }


  CrearFormulario(){
    this.CobranzaForm = this.FormBuilder.group({
      'institucion': [null, [Validators.required]],
      'sede': [null, [Validators.required]],
    })
  }

  ListarSede(i) {
    this.GServicios.ListarSede(i, '').subscribe(res => {
      this.Sede =  [];
      // tslint:disable-next-line:forin
      for(let i in res){
        this.Sede.push(res [i] );
      }
      console.log(this.Sede)
  // tslint:disable-next-line:semicolon
  })}

  InstitucionSeleccionada(event) {
    this.ListarSede(event.value);
    
  }

  SedeSeleccionada(event) {
    console.log(event)
    this.sede= event.value
    console.log(this.sede)
  }

  
}

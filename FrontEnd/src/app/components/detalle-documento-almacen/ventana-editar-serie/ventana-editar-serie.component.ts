import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {FormGroup, FormBuilder} from '@angular/forms';
import {ServiciosProductoSerie} from '../../global/productoserie';

@Component({
  selector: 'app-ventana-editar-serie',
  templateUrl: './ventana-editar-serie.component.html',
  styleUrls: ['./ventana-editar-serie.component.css'],
  providers: [ServiciosProductoSerie]
})
export class VentanaEditarSerieComponent implements OnInit {

	public EditarSerieForm: FormGroup;
  public Informacion:any = {id:null, id_producto:null,serie:"", color:"", almacenamiento:"",precio:null};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private Builder: FormBuilder,
    private SServicio: ServiciosProductoSerie,
  ) { }

  ngOnInit() {

    this.ActualizarInformacion();

  }

  ActualizarInformacion(){
    this.SServicio.Seleccionar(this.data.id_serie).subscribe(res=>{
      // console.log(res)
      this.Informacion.id=res.id_producto_serie;
      this.Informacion.id_producto=res.id_producto;
      this.Informacion.serie=res.serie;
      this.Informacion.color=res.color;
      this.Informacion.almacenamiento=res.almacenamiento;
      this.Informacion.precio=res.precio;
    })
  }

}

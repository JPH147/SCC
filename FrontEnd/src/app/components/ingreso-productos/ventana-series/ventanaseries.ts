import { Component, OnInit, Inject } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatCard, MatInputModule, MatButton, MatDatepicker, MatTableModule,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-ventanaseries',
  templateUrl: './ventanaseries.html',
  styleUrls: ['./ventanaseries.css']
})

export class ventanaseries  implements OnInit {

  public seriearticulo: Array<any> = [];
  public numero: number;
  public series: Array <string>;
  public contador: number;
  public serie: Array<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<ventanaseries>
  ) { }

  ngOnInit() {
    // console.log(this.data,this.data.producto);
    this.contador = 1;
    this.seriearticulo = [{numero: this.contador, producto:this.data.producto,series: '', color:'', almacenamiento:''} ];

    if (this.data.series.length>0) {
      let is:number=0;
      for (let i of this.data.series) {
        if (this.data.producto==i.id_producto) {
          this.seriearticulo.push({numero:this.contador, producto: this.data.producto,series:i.serie})
          this.contador++;
          is++;
        }
      }

      if (is>0) {
        this.seriearticulo.splice(0,1)
      }else{
        
      }

    }else{
      // this.seriearticulo = [{numero: this.contador, producto:this.data.producto,series: ''} ];
    }

   }

  AgregarSerieVS() {
    this.contador++;
    this.seriearticulo.push({numero: this.contador, producto: this.data.producto, series: '', color:'', almacenamiento:''});
  }

  Aceptar() {
    
    // if (this.data.series.length>0) {
    //   this.EliminarElemento(this.data.series,this.data.producto)
    // }

    return this.seriearticulo
  }

  EliminarElemento(array,value){
     array.forEach( (item, index) => {
       if(item.id_producto == value) array.splice(index,1);
     });
  }

  onNoClick(){
    this.ventana.close();
    return false
  }

}

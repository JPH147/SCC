import {Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatSnackBar, MatSelect} from '@angular/material';
import {FormControl, FormGroup, FormBuilder,FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { NgControl } from '@angular/forms';
import { ServiciosGenerales } from '../../../global/servicios';
import {fromEvent,merge} from 'rxjs';
import {debounceTime, tap, distinctUntilChanged} from 'rxjs/operators'

@Component({
  selector: 'app-ventanaemergentemarca',
  templateUrl: './ventanaemergente.html',
  styleUrls: ['./ventanaemergente.css'],
  providers: [ServiciosGenerales]
})

// tslint:disable-next-line:component-class-suffix
export class VentanaEmergenteMarca {

  @ViewChild ('InputMarca') FiltroMarca: ElementRef;
  @ViewChild('InputTipo') FiltroTipo: MatSelect;
  public selectedValue: string;
  public MarcaForm: FormGroup;
  public Tipo: Array<any>;
  public lsttipos: any[] = [];
  public mensaje: string;
  public total: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public ventana: MatDialogRef<VentanaEmergenteMarca>,
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
    this.MarcaForm = this.FormBuilder.group({
      'nombre': [null, [
        Validators.required
      ]],
      'idtipo': [null, [
        Validators.required
      ]]
    });

    this.Servicios.ListarTipoProductos2(null,'', '',1,100).subscribe(res=>{


      this.lsttipos = res['data'].tipo_productos;
      
      this.lsttipos.forEach((item)=>{
        delete item["numero"]
      });

      if (this.data) {

        this.MarcaForm.get('nombre').setValue(this.data.marca);
        // this.MarcaForm.get('idtipo').setValue(this.data.idtipo);
        this.Servicios.ListarTipoProductos2(this.data.idtipo,"","",1,1).subscribe(rest=>{
          
          delete rest['data'].tipo_productos[0]["numero"];

          this.MarcaForm.get('idtipo').setValue(rest['data'].tipo_productos[0])
          
          console.log(this.lsttipos,this.MarcaForm.value.idtipo)
        })
      }

    });


  }

  ngAfterViewInit(){
    merge(
      fromEvent(this.FiltroMarca.nativeElement,'keyup'),
      this.FiltroTipo.selectionChange
    )
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(()=>{
        if (this.MarcaForm.value.idtipo) {
          this.Servicios.ListarMarca2(this.MarcaForm.value.idtipo.nombre,this.FiltroMarca.nativeElement.value.trim(),1,1).subscribe(res=>{
            if (res) {
              this.total=res['data'].marca.length;
            }else{
              this.total=0
            }
          })
        }
      })
    ).subscribe()
  }

  Guardar(formulario) {
    if (this.data) {
      this.mensaje = 'Datos actualizados satisfactoriamente';
      this.Servicios.EditarMarca(this.data.id, formulario.value.idtipo.id, formulario.value.nombre).subscribe();
    }

    if (!this.data) {
      this.mensaje = 'Marca creada satisfactoriamente';
      this.Servicios.CrearMarca(formulario.value.idtipo, formulario.value.nombre).subscribe();
    }
      this.MarcaForm.reset();
      this.ventana.close();
  }

  Notificacion(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

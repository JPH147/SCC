import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent,merge } from 'rxjs';
import { ProveedorService } from './proveedores.service';
import { ProveedorDataSource } from './proveedores.dataservice';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ProveedoresMovimientosComponent } from '../proveedores-movimientos/proveedores-movimientos.component'
import { VentanaEmergenteProveedores } from './ventana-emergente/ventana-emergente.component';
import { VentanaConfirmarComponent } from '../../compartido/componentes/ventana-confirmar/ventana-confirmar.component';
import { FileUploadProveedores } from '../file-upload/fileupload';
import { VentanaFotoComponent } from '../../compartido/componentes/ventana-foto/ventana-foto.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ProveedorService]
})
export class ProveedoresComponent implements OnInit {

  ListadoProveedor: ProveedorDataSource;
  Columnas: string[] = ['numero', 'foto','tipo_documento', 'ruc', 'nombre','opciones'];
  public maestro;

  @ViewChild('InputRUC', { static: true }) FiltroRuc: ElementRef;
  @ViewChild('InputNombreProvedor', { static: true }) FiltroNombre: ElementRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private Servicio: ProveedorService,
    private DialogoMovimiento: MatDialog,
    public DialogoProveedores: MatDialog,

    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.ListadoProveedor = new ProveedorDataSource(this.Servicio);
    this.ListadoProveedor.CargarProveedores('','','',1,10);
  }


  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.paginator.page.subscribe(res=>{
      this.CargarData();
    })

    merge(
      fromEvent(this.FiltroNombre.nativeElement, 'keyup'),
      fromEvent(this.FiltroRuc.nativeElement, 'keyup')
    )    
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     tap(() => {
       this.paginator.pageIndex=0;
       this.CargarData();
     })
    ).subscribe();
  }

  VerDetalle(proveedor){
    let VentanaDialogo = this.DialogoMovimiento.open(ProveedoresMovimientosComponent,{
       width: '1200px',
       data: {id: proveedor.id, nombre: proveedor.nombre}
    })
  }

  CargarData() {
    this.ListadoProveedor.CargarProveedores('',
      this.FiltroRuc.nativeElement.value,
      this.FiltroNombre.nativeElement.value,
      this.paginator.pageIndex +1,
      this.paginator.pageSize);
  }

  Agregar() {
    // tslint:disable-next-line:prefer-const
    let VentanaProveedores = this.DialogoProveedores.open(VentanaEmergenteProveedores, {
      width: '800px'
    });
 
    VentanaProveedores.afterClosed().subscribe(res => {
     this.CargarData();
   });
  }

  VerFoto(nombre,imagen){
    let VentanaFoto = this.DialogoProveedores.open(VentanaFotoComponent, {
      width: '600px',
      data: {nombre: nombre, imagen: imagen}
    });
  }

  Eliminar(proveedor) {
    // tslint:disable-next-line:prefer-const
    let VentanaConfirmar = this.DialogoProveedores.open(VentanaConfirmarComponent, {
      width: '400px',
      data: {objeto: 'proveedor', valor: proveedor.nombre}
    });
    VentanaConfirmar.afterClosed().subscribe(res => {
      if (res === true) {
       // tslint:disable-next-line:no-shadowed-variable
       this.Servicio.Eliminar(proveedor.id).subscribe(res => {
         this.CargarData();
         this.snackBar.open('Se eliminó el proveedor satisfactoriamente.', '', {
          duration: 2500, verticalPosition: 'bottom'
        });
       });
      }
    });
   }

   Editar(id) {
    this.Servicio.Seleccionar(id).subscribe(res => {
      // tslint:disable-next-line:prefer-const
      let VentanaProveedores = this.DialogoProveedores.open(VentanaEmergenteProveedores, {
        width: '800px',
        data: {objeto: res, id: id},
  
      });
      // tslint:disable-next-line:no-shadowed-variable
      VentanaProveedores.afterClosed().subscribe (res => {
        this.CargarData();
      });
    });
  }

  SubirImagen(proveedor) {
    // tslint:disable-next-line:prefer-const
    let VentanaFileUpload = this.DialogoProveedores.open(FileUploadProveedores, {
      width: '800px',
      data : proveedor
    });

    VentanaFileUpload.afterClosed().subscribe(res=>{
      this.CargarData()
    })
  }

}

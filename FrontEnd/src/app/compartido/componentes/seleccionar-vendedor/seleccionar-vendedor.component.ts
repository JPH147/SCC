import {Component, OnInit, ViewChild, AfterViewInit, Inject} from '@angular/core';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of, merge} from 'rxjs';
import {catchError, finalize,debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ServiciosGenerales } from 'src/app/core/servicios/servicios';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-seleccionar-vendedor',
  templateUrl: './seleccionar-vendedor.component.html',
  styleUrls: ['./seleccionar-vendedor.component.css']
})
export class SeleccionarVendedorComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public ListadoCliente: ClienteDataSource;
  public Columnas: string[] = ['dni', 'nombre', 'opciones'];

  public VendedoresForm : FormGroup ;
  public VendedoresSeleccionados : Array<any> = [] ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data ,
    public ventana : MatDialogRef<SeleccionarVendedorComponent> ,
    private _builder : FormBuilder ,
  	private Servicio : ServiciosGenerales ,
  ) { }

  ngOnInit() {
    this.ListadoCliente = new ClienteDataSource(this.Servicio);
    this.CrearFormulario() ;

    if ( this.data.vendedores.length > 0 ) {
      this.data.vendedores.map(( item ) => {
        let vendedor = {
          id : item.id_vendedor ,
          nombre : item.vendedor_nombre ,
        } ;
        this.VendedoresSeleccionados.push(vendedor) ;
        return item ;
      })
    }

    this.CargarInformacion() ;
  }

  ngAfterViewInit() {
    merge(
      this.VendedoresForm.get('documento').valueChanges ,
      this.VendedoresForm.get('nombre').valueChanges
    ).pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex=0;
        this.CargarInformacion();
      })
     ).subscribe();

     this.paginator.page
     .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.CargarInformacion();
      })
     ).subscribe();
  }

  CrearFormulario() {
    this.VendedoresForm = this._builder.group({
      documento : '' ,
      nombre : ''
    })
  }

  CargarInformacion(){
  	this.ListadoCliente.CargarVendedores(
      this.VendedoresSeleccionados ,
      this.VendedoresForm.get('documento').value ,
      this.VendedoresForm.get('nombre').value ,
      this.paginator ? this.paginator.pageIndex+1 : 1
  	)
  }

  VendedorSeleccionado( evento : MatCheckboxChange, vendedor : any ) {
    if ( evento.checked ) {
      this.AgregarVendedor(vendedor) ;
    } else {
      this.QuitarVendedor(vendedor) ;
    }
  }

  AgregarVendedor( vendedor ){
    this.VendedoresSeleccionados.push(vendedor) ;
  }

  QuitarVendedor( vendedor ) {
    this.VendedoresSeleccionados = this.VendedoresSeleccionados.filter(e => e.id != vendedor.id ) ;
  }

  GuardarVendedores() {
    this.ventana.close(this.VendedoresSeleccionados) ;
  }
}

export class ClienteDataSource implements DataSource<any> {

  private InformacionVendedores = new BehaviorSubject<any>([]);
  public CargandoInformacion = new BehaviorSubject<boolean>(false);
  public Cargando = this.CargandoInformacion.asObservable();
  public TotalResultados = new BehaviorSubject<number>(0);
  private tiempo_consulta = new BehaviorSubject<number>(0)

  constructor(
    private Servicio: ServiciosGenerales
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<any> {
    return this.InformacionVendedores.asObservable();
  }

  disconnect(){
    this.InformacionVendedores.complete();
    this.CargandoInformacion.complete();
  }

  CargarVendedores(
    vendedores_seleccionados: Array<any> ,
    dni: string,
    nombre: string,
    pagina: number,
  ){
    this.CargandoInformacion.next(true);

    this.tiempo_consulta.next(new Date().getTime()) ;

    this.Servicio.ListarVendedor2( dni, nombre, pagina, 5)
    .pipe(
      catchError(() => of([])),
      finalize(() => this.CargandoInformacion.next(false))
    ).subscribe(res => {
      if( res ) {
        res['data'].vendedores.map((vendedor)=>{
          vendedor.numero = vendedores_seleccionados.some(e => e.id == vendedor.id) ;
          return vendedor ;
        })

        this.TotalResultados.next( res['mensaje'] ) ;
        this.InformacionVendedores.next( res['data'].vendedores ) ;
      }else{
        this.TotalResultados.next(0) ;
        this.InformacionVendedores.next([]) ;
      }
    });
  }

}
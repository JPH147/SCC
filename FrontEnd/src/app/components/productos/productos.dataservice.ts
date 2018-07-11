import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Producto, ProductoService} from './productos.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';
import {of} from 'rxjs';

export class ProductoDataSource implements DataSource<Producto>{
	
	private InformacionProductos = new BehaviorSubject<Producto[]>([]);
	private CargandoInformacion = new BehaviorSubject<boolean>(false);
	private Cargando = this.CargandoInformacion.asObservable();

	constructor(private Servicio: ProductoService){ }

	connect(collectionViewer: CollectionViewer): Observable<Producto[]>{
		return this.InformacionProductos.asObservable();
	}

	disconnect(){
		this.InformacionProductos.complete();
		this.CargandoInformacion.complete();
	}

	CargarProductos(
		id:number
	){
		this.CargandoInformacion.next(true);

		this.Servicio.Listado(id)
		.pipe(catchError(()=>of([])),
		finalize(()=>this.CargandoInformacion.next(false))
		)
		.subscribe(res=>this.InformacionProductos.next(res))
	}

}

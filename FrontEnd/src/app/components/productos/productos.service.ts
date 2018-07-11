import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()

export class ProductoService {
	
	public url:string = 'http://localhost/SCC/WS_SCC/';

	constructor(private http:HttpClient){}

	Listado(){
		return this.http.get(this.url+'producto/read.php')
						.pipe(map(res=>res["data"].productos))
	}
}
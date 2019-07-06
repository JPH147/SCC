import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable()

export class ServiciosVentas{
	public url:string = URL.url;

	constructor(
		private http:HttpClient,
	){}

	ListarTalonarioSerie():Observable<any>
	{
		return this.http.get(this.url+'talonario/read-serie.php',{
			params: new HttpParams()
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].series
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	ListarTalonarioNumero(
		serie:number
	):Observable<any>
	{
		let Serie:string

		if (serie) {
			Serie=serie.toString()
		}else{
			Serie=""
		}

		return this.http.get(this.url+'talonario/read-numero.php',{
			params: new HttpParams()
			.set('prserie',Serie)
		})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].numeros
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	ListarBancos(){
		return this.http.get(this.url+'banco/read.php')
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data'].bancos
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	ListarComisionRetenida(){
		return this.http.get(this.url+'comision-retenida/read.php')
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res=res['data']
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	CrearComisionVendedor(
		id_salida:number,
		vendedor:number,
		comision_efectiva_porcentaje:number,
		comision_efectiva:number,
		comision_retenida_porcentaje:number,
		comision_retenida:number,
	  ): Observable<any>{
		let params = new HttpParams()
		.set('prsalida',id_salida.toString())
		.set('prvendedor',vendedor.toString())
		.set('prcomisionefectivaporcentaje',comision_efectiva_porcentaje.toString())
		.set('prcomisionefectiva',comision_efectiva.toString())
		.set('prcomisionretenidaporcentaje',comision_retenida_porcentaje.toString())
		.set('prcomisionretenida',comision_retenida.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/create-comision.php', params, {headers: headers});
	}

	ListarVendedores(
    documento : string ,
    nombre : string ,
    pagina : number ,
    total_pagina : number
  ){

    let params = new HttpParams()
      .set("prdocumento", documento)
      .set("prnombre", nombre)
      .set("prpagina", pagina.toString())
      .set("prtotalpagina", total_pagina.toString())

		return this.http.get(this.url+'vendedor/read.php', {params})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res;
			}else{
				console.log('No hay datos que mostrar')
			}
		}))
	}

	CrearVendedor(
    documento:string,
		nombre:string,
		email:string,
		comision:number,
	  ): Observable<any>{
		let params = new HttpParams()
		  .set('prdocumento',documento)
		  .set('prnombre',nombre)
		  .set('premail',email)
		  .set('prcomision',comision.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/create.php', params, {headers: headers});
	}

	ActualizarVendedor(
    id_vendedor:number,
    documento:string,
		nombre:string,
		email:string,
		comision:number,
	  ): Observable<any>{
		let params = new HttpParams()
		  .set('prid',id_vendedor.toString())
		  .set('prdocumento',documento)
		  .set('prnombre',nombre)
		  .set('premail',email)
		  .set('prcomision',comision.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/update.php', params, {headers: headers});
	}

	EliminarVendedor(
    id_vendedor:number
  ): Observable<any>{
    
		let params = new HttpParams()
		  .set('prid',id_vendedor.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/delete.php', params, {headers: headers});
	}

	ListarTalonarios(
		serie : string ,
		numero : number ,
		pagina : number ,
		total_pagina : number
	  ){
	
		let params = new HttpParams()
		  .set("prserie", serie)
		  .set("prnumero", numero.toString())
		  .set("prnumeropagina", pagina.toString())
		  .set("prtotalpagina", total_pagina.toString())
	
			return this.http.get(this.url+'talonario/read.php', {params})
			.pipe(map(res=>{
				if(res['codigo']===0){
					return res;
				}else{
					console.log('No hay datos que mostrar')
				}
			}))
		}
	
	CrearTalonarios(
		serie:string,
		numero_inicio:number,
		numero_fin:number,
	): Observable<any>{
		let params = new HttpParams()
			.set('prserie',serie)
			.set('prnumeroinicio',numero_inicio.toString())
			.set('prnumerofin',numero_fin.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'talonario/create.php', params, {headers: headers});
	}
  
  // Esta función se usa para anular o revertir talonarios
	ActualizarTalonarios(
    serie : string,
    estado : number
  ): Observable<any>{
		let params = new HttpParams()
			.set('prserie',serie)
			.set('prestado',estado.toString())
  
    console.log(params)

		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'talonario/update.php', params, {headers: headers});
	}

}

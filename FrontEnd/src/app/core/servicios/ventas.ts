import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {URL, URLIMAGENES} from './url'
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators'

@Injectable({
	providedIn: 'root'
})

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
    cargo : string ,
    id_cargo : number ,
    pagina : number ,
    total_pagina : number
  ){
    let params = new HttpParams()
      .set("prdocumento", documento)
      .set("prnombre", nombre)
      .set("prcargo", cargo)
      .set("pridcargo", id_cargo.toString())
      .set("prpagina", pagina.toString())
      .set("prtotalpagina", total_pagina.toString())

		return this.http.get(this.url+'vendedor/read.php', {params})
		.pipe(map(res=>{
			if(res['codigo']===0){
        		res['data'].vendedores = res['data'].vendedores.map(item=>{
                  item.foto = URLIMAGENES.carpeta + 'vendedor/' + item.foto;
                  item.dni = item.dni.substring(1);
                  return item;
                })
				// console.log(res)
				return res;
			}else{
        console.log('No hay datos que mostrar');
        return {data:{vendedores:[]}, total:0};
			}
		}))
	}

	CrearVendedor(
    documento:string,
		nombre:string,
		cargo:number,
		email:string,
		comision:number,
	  ): Observable<any>{
		let params = new HttpParams()
		  .set('prdocumento',documento)
		  .set('prnombre',nombre)
		  .set('prcargo',cargo.toString())
		  .set('premail',email)
		  .set('prcomision',comision.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/create.php', params, {headers: headers});
	}

	ActualizarVendedor(
    id_vendedor:number,
    documento:string,
		nombre:string,
		cargo:number,
		email:string,
		comision:number,
	  ): Observable<any>{
		let params = new HttpParams()
		  .set('prid',id_vendedor.toString())
		  .set('prdocumento',documento)
		  .set('prnombre',nombre)
		  .set('prcargo',cargo.toString())
		  .set('premail',email)
		  .set('prcomision',comision.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/update.php', params, {headers: headers});
	}

  ActualizarFoto(
    id_vendedor : number,
    clt_foto : string
  ): Observable<any> {
    let params = new HttpParams()
    .set('prvendedor', id_vendedor.toString())
    .set('prfoto', clt_foto);

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'vendedor/updateimage.php', params, {headers: headers}).pipe(map(res => {
      return res;
    }));
  }

	EliminarVendedor(
    id_vendedor:number
  ): Observable<any>{
    
		let params = new HttpParams()
		  .set('prid',id_vendedor.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/delete.php', params, {headers: headers});
	}

	ListarVendedorCargo(
    nombre : string ,
    pagina : number ,
    total_pagina : number
  ){
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", pagina.toString())
      .set("prtotalpagina", total_pagina.toString())

		return this.http.get(this.url+'vendedor/read-cargo.php', {params})
		.pipe(map(res=>{
			if(res['codigo']===0){
				return res;
			}else{
				console.log('No hay datos que mostrar');
				return {data:{vendedores:[]}, total:0};
			}
		}))
	}

	CrearVendedorCargo(
		nombre:string,
	  ): Observable<any>{
		let params = new HttpParams()
		  .set('prnombre',nombre)
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/create-cargo.php', params, {headers: headers});
	}

	ActualizarVendedorCargo(
    id_cargo:number ,
		nombre:string,
	  ): Observable<any>{
    let params = new HttpParams()
      .set('prcargo', id_cargo.toString())
		  .set('prnombre',nombre)
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/update-cargo.php', params, {headers: headers});
	}

  EliminarVendedorCargo(
    id_cargo:number
  ): Observable<any>{
    let params = new HttpParams()
      .set('prcargo', id_cargo.toString())
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'vendedor/delete-cargo.php', params, {headers: headers});
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
				return false ;
      }
    }))
  }
	
	ListarTalonariosDetalle(
		serie : string ,
	  ) : Observable<any> {
	
		let params = new HttpParams()
		  .set("prserie", serie) ;
	
    return this.http.get(this.url+'talonario/read-detalle.php', {params})
    .pipe(map(res=>{
      if(res['codigo']===0){
        return res['data']['talonarios'] ;
      }else{
				console.log('No hay datos que mostrar') ;
				return [] ;
      }
    }))
	}
	
  VerificarTalonario(
		serie : string 
	  ){
		let params = new HttpParams()
		  .set("prserie", serie);
	
    return this.http.get(this.url+'talonario/verificar.php', {params})
    .pipe(map(res=>{
      if(res['codigo']===0){
        return true;
      }else{
        return false;
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
  
  // Esta función se usa para anular talonarios. Si se va a utilizar para otra cosa, revisar SP.
	ActualizarTalonarios(
    serie : string,
    estado : number
  ): Observable<any>{
		let params = new HttpParams()
			.set('prserie',serie)
			.set('prestado',estado.toString())
  
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'talonario/update.php', params, {headers: headers});
	}

	ListarAdjuntosTalonario(
		id_talonario : number ,
	) :Observable<any> {
	
		let params = new HttpParams()
		  .set("prtalonario", id_talonario.toString()) ;
	
    return this.http.get(this.url+'talonario/read-adjuntoxtalonario.php', {params})
    .pipe(map(res=>{
      if(res['codigo']===0){
        return res['data'];
      }else{
				console.log('No hay datos que mostrar') ;
				return false ;
      }
    }))
  }

	CrearAdjuntosTalonario(
		id_talonario : number ,
		pdf_contrato : string ,
	): Observable<any>{
		let params = new HttpParams()
			.set('prtalonario',id_talonario.toString() )
			.set('prpdfcontrato',pdf_contrato ) ;
	
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
	
		return this.http.post(this.url + 'talonario/create-adjunto.php', params, {headers: headers});
	}
}

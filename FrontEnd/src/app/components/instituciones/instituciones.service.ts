import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'
import {map} from 'rxjs/operators';
import {URL} from '../global/url';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class InstitucionesService {

  public url: string = URL.url;

  constructor(
      private http : HttpClient
  ){}

  ListarInstitucion(
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"institucion/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  ListarSede(
    institucion : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"sede/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  ListarSedeParametros(
    sede : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prsede", sede.toString());

    return this.http.get(this.url+"sede/read-parametros.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res['data'][0];
      } else {
        console.log('No hay datos que mostrar');
        return [];
      }
    }))
  }

  ListarSubsede(
    institucion : string,
    sede : string,
    nombre : string,
    numero_pagina : number,
    total_pagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prsede", sede)
      .set("prnombre", nombre)
      .set("prpagina", numero_pagina.toString())
      .set("prtotalpagina", total_pagina.toString());

    return this.http.get(this.url+"subsede/read-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearInstitucion(
    nombre : string
  ){
    let params = new HttpParams()
      .set('prnombre', nombre )
      .set('prabreviatura', "" )
      .set('prrepresentante', "" )
      .set('prdistrito', "0" )
      .set('prdireccion', "" )
      .set('prtelefono', "" )
      .set('prcodigocooperativa', "" );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'institucion/create.php', params, {headers: headers});    
  }

  ActualizarInstitucion(
    id_institucion : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_institucion.toString() )
      .set('prnombre', nombre )
      .set('prabreviatura', "" )
      .set('prrepresentante', "" )
      .set('prdistrito', "0" )
      .set('prdireccion', "" )
      .set('prtelefono', "" )
      .set('prcodigocooperativa', "" );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'institucion/update.php', params, {headers: headers});    
  }

  CrearSede(
    id_institucion : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prinstitucion', id_institucion.toString() )
      .set('prnombre', nombre )
      .set('prabreviatura',"")
      .set('prrepresentante',"")
      .set('prdistrito',"0")
      .set('prdireccion',"")
      .set('prtelefono',"")
      .set('prcodigocooperativa',"")
      .set('prplantillatarjeta',"")
      .set('prplantillaautorizacion',"")
      .set('prplantilladdjj',"")
      .set('prplantillacompromiso',"")
      .set('prplantillattransaccion',"") ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'sede/create.php', params, {headers: headers});    
  }

  ActualizarSede(
    id_sede : number ,
    id_institucion : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_sede.toString() )
      .set('prinstitucion', id_institucion.toString() )
      .set('prnombre', nombre )
      .set('prabreviatura',"")
      .set('prrepresentante',"")
      .set('prdistrito',"0")
      .set('prdireccion',"")
      .set('prtelefono',"")
      .set('prcodigocooperativa',"")
      .set('prplantillatarjeta',"")
      .set('prplantillaautorizacion',"")
      .set('prplantilladdjj',"")
      .set('prplantillacompromiso',"")
      .set('prplantillattransaccion',"") ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'sede/update.php', params, {headers: headers});    
  }

  ActualizarSedeParametros(
    id_sede : number ,
    parametro_condicion : string ,
    parametro_domicilio : string ,
    parametro_autorizacion_1 : string ,
    parametro_autorizacion_2 : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_sede.toString() )
      .set('prcondicion', parametro_condicion )
      .set('prdomicilio', parametro_domicilio )
      .set('prautorizacion1', parametro_autorizacion_1 )
      .set('prautorizacion2', parametro_autorizacion_2 );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'sede/update-parametros.php', params, {headers: headers});    
  }

  CrearSubsede(
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prsede', id_sede.toString() )
      .set('prnombre', nombre )
      .set('prabreviatura',"")
      .set('prrepresentante',"")
      .set('prdistrito',"0")
      .set('prdireccion',"")
      .set('prtelefono',"")
      .set('prcodigocooperativa',"");

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'subsede/create.php', params, {headers: headers});    
  }

  ActualizarSubsede(
    id_subsede : number ,
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_subsede.toString() )
      .set('prsede', id_sede.toString() )
      .set('prnombre', nombre )
      .set('prabreviatura',"")
      .set('prrepresentante',"")
      .set('prdistrito',"0")
      .set('prdireccion',"")
      .set('prtelefono',"")
      .set('prcodigocooperativa',"");

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'subsede/update.php', params, {headers: headers});    
  }

  ListarCargos(
    institucion : string,
    sede : string,
    cargo : string,
    pagina : number,
    totalpagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prsede", sede)
      .set("prcargo", cargo)
      .set("prpagina", pagina.toString())
      .set("prtotalpagina", totalpagina.toString());

    return this.http.get(this.url+"cargo/read-cargo-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:{cargos:[]}};
      }
    }))
  }

  ListarCargoEstados(
    institucion : string,
    sede : string,
    cargo_estado : string,
    pagina : number,
    totalpagina : number,
  ) :Observable<any> {
    let params = new HttpParams()
      .set("prinstitucion", institucion)
      .set("prsede", sede)
      .set("prcargoestado", cargo_estado)
      .set("prpagina", pagina.toString())
      .set("prtotalpagina", totalpagina.toString());

    return this.http.get(this.url+"cargo/read-cargo-estado-normal.php",{params})
    .pipe(map((res)=>{
      if (res['codigo'] === 0) {
        return res;
      } else {
        console.log('No hay datos que mostrar');
        return {mensaje:0, data:[]};
      }
    }))
  }

  CrearCargo(
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prsede', id_sede.toString() )
      .set('prcargo', nombre );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/crear-cargo.php', params, {headers: headers}) ;
    ;    
  }

  ActualizarCargo(
    id_cargo : number ,
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prid', id_cargo.toString() )
      .set('prsede', id_sede.toString() )
      .set('prcargo', nombre );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/actualizar-cargo.php', params, {headers: headers})
    .pipe(map(res=>{
      console.log(res,params);
      return res;
    }))
  }

  CrearCargoEstado(
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prsede', id_sede.toString() )
      .set('prcargoestado', nombre );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/crear-cargo-estado.php', params, {headers: headers});    
  }

  ActualizarCargoEstado(
    id_cargo_estado : number ,
    id_sede : number ,
    nombre : string ,
  ){
    let params = new HttpParams()
      .set('prcargoestado', id_cargo_estado.toString() )
      .set('prsede', id_sede.toString() )
      .set('prnombre', nombre );

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/actualizar-cargo-estado.php', params, {headers: headers})
    .pipe(map(res=>{
      console.log(res,params);
      return res;
    }))
  }

  EliminarInstitucion(
    id_institucion : number
  ){
    let params = new HttpParams()
      .set('prid', id_institucion.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'institucion/delete.php', params, {headers: headers});    
  }

  EliminarSede(
    id_sede : number
  ){
    let params = new HttpParams()
      .set('prid', id_sede.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'sede/delete.php', params, {headers: headers});    
  }

  EliminarSubsede(
    id_subsede : number
  ){
    let params = new HttpParams()
      .set('prid', id_subsede.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'subsede/delete.php', params, {headers: headers});    
  }

  EliminarCargo(
    id_cargo : number
  ){
    let params = new HttpParams()
      .set('prid', id_cargo.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/eliminar-cargo.php', params, {headers: headers});    
  }

  EliminarCargoEstado(
    id_cargo_estado : number
  ){
    let params = new HttpParams()
      .set('prid', id_cargo_estado.toString() ) ;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.url + 'cargo/eliminar-cargo-estado.php', params, {headers: headers});    
  }

}
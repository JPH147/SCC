import { Cliente } from './../clientes/clientes.service';
import { TipoProductoModelo } from './servicios';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {URL} from './url';
import * as moment from 'moment';
import { equalParamsAndUrlSegments } from '../../../../node_modules/@angular/router/src/router_state';

@Injectable()

export class ServiciosGenerales {
  public url: string = URL.url;

  constructor(
    private http: HttpClient) { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {}
 // F=moment(fecha).format('YYYY/MM/DD');
  ListarTipoProductos(
    id:number,
    nombre: string,
    unidad_medida: string
  ): Observable<any> {

  let id_producto:string;

  if (id) {
    id_producto=id.toString()
  }else{
    id_producto='';
  }

  return this.http.get(this.url + 'productotipo/read.php',{ params: new HttpParams()
    .set('prid',id_producto)
    .set('prnombre',nombre)
    .set('prum',unidad_medida)
  })
  .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].tipo_productos;
    } else {
        // console.log('No hay datos que mostrar');
    }
  }));
  }

  ListarTipoProductos2(
    id:number,
    nombre: string,
    unidad_medida: string,
    prpagina: number,
    prtotalpagina: number
  ): Observable<any> {
  // tslint:disable-next-line:max-line-length

  let id_producto:string;

  if (id) {
    id_producto=id.toString()
  }else{
    id_producto='';
  }

  return this.http.get(this.url + 'productotipo/read2.php', {params: new HttpParams()
    .set('prid',id_producto)
    .set('prnombre',nombre)
    .set('prum',unidad_medida)
    .set('prpagina',prpagina.toString())
    .set('prtotalpagina',prtotalpagina.toString())
    })

  .pipe(map(res => {
    if (res['codigo'] === 0 ) {
      return res;
    } else {
      // return res
      // console.log('No hay datos que mostrar');
    }
  }));
  }

  CrearTipoProducto(
    nombre: string,
		id: number
	):Observable<any>{
		let params=new HttpParams()
						.set('tprd_nombre', nombre)
						.set('idunidadmedida', id.toString());
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'productotipo/create.php',params,{headers:headers});
  }
  
  EditarTipoProducto(id:number,
    nombre: string,
    idunidadmedida: number):Observable<any>{
      let params=new HttpParams()
              .set('id', id.toString())
              .set('nombre', nombre.toString())
              .set('idunidad', idunidadmedida.toString());
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url+'productotipo/update.php',params,{headers:headers});
    }

    SeleccionarTipo(
      id:number
    ):Observable<any[]>
    {
      return this.http.get(this.url+'productotipo/readxId.php',{
        params: new HttpParams()
        .set('id', id.toString())
      })
      .pipe(map(res=>{
        if(res['codigo']===0){
          return res=res['data']
        }else{
          // console.log('No hay datos que mostrar')
        }
      }))
    }

    EliminarTipo(id:number):Observable<any>{
      let params = new HttpParams().set('idtipo',id.toString());
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      return this.http.post(this.url + 'productotipo/delete.php', params, {headers: headers});

    }

  ListarUnidadMedida(
    tipo_producto:string
  ):Observable<any>{

    return this.http.get(this.url + 'productotipo/read_um.php', {
    params: new HttpParams()
    .set('prproducto',tipo_producto)
    })
    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res;
      }  else {
          // console.log('No hay datos que mostrar');
          // return res;
      }
    }));
  }

  ListarMarca(
    id_tipo: string,
    nombre: string
  ): Observable<any> {
       return this.http.get(this.url + 'productomarca/read.php?prtipo=' + id_tipo + '&prmarca=' + nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].marca;
      } else {
          // console.log('No hay datos que mostrar');
      }
  }));
  }

  CrearMarca(
    id:number,
		marca:string
	):Observable<any>{
		let params=new HttpParams()
						.set('idtipoproducto', id.toString())
						.set('marca', marca );
		let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
		return this.http.post(this.url+'productomarca/create.php',params,{headers:headers});
	}

  ListarMarca2(
    tipo: string,
    nombre: string,
    prpagina: number,
    prtotalpagina: number
  ): Observable<any> {
       // tslint:disable-next-line:max-line-length
       return this.http.get(this.url + 'productomarca/read2.php',{params: new HttpParams()
        .set('prtipo',tipo)
        .set('prnombre',nombre)
        .set('prpagina',prpagina.toString())
        .set('prtotalpagina',prtotalpagina.toString())
        })
      .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res;
      } else {
          // console.log('No hay datos que mostrar');
      }
  }));
  }

  EditarMarca(id: number,
    idtipoproducto: number,
    marca: string): Observable<any> {
      let params = new HttpParams()
              .set('id', id.toString())
              .set('idtipoproducto', idtipoproducto.toString())
              .set('marca', marca.toString());
      let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this.http.post(this.url + 'productomarca/update.php', params, {headers: headers});
    }


    SeleccionarMarca(
      id: number
    ): Observable<any[]> {
      return this.http.get(this.url + 'productomarca/readxId.php', {
        params: new HttpParams()
        .set('prid', id.toString())
      })
      .pipe(map(res=>{
        if (res['codigo'] === 0){
          return res = res['data'];
        } else {
          // console.log('No hay datos que mostrar');
        }
      }));
    }

    EliminarMarca(id:number):Observable<any>{
      let params = new HttpParams().set('idmarca',id.toString());
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      return this.http.post(this.url + 'productomarca/delete.php', params, {headers: headers});

    }


  ListarModelo(
    id_marca: string,
    nombre: string
  ): Observable<any> {
      return this.http.get(this.url + 'productomodelo/read.php?prmarca=' + id_marca + '&prnombre=' + nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
          return res['data'].modelo;
      } else {
        // console.log('No hay datos que mostrar');
      }
    }));
}

CrearModelo(
  id: number,
  modelo: string
): Observable<any> {
  // tslint:disable-next-line:prefer-const
  let params = new HttpParams()
          .set('idmarca', id.toString())
          .set('modelo', modelo );
  let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
  return this.http.post(this.url + 'productomodelo/create.php', params, {headers: headers});
}


ListarModelo2(
  tipo: string,
  marca: string,
  nombre: string,
  prpagina: number,
  prtotalpagina: number
): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(this.url + 'productomodelo/read2.php', {
      params: new HttpParams()
        .set('prtipo', tipo)
        .set('prmarca', marca)
        .set('prnombre',nombre)
        .set('prpagina', prpagina.toString())
        .set('prtotalpagina',prtotalpagina.toString())
    })
    .pipe(map(res => {
    if (res['codigo'] === 0 ) {
        return res;
    } else {
      // console.log('No hay datos que mostrar');
    }
  }));
}

EditarModelo(
  id: number,
  idmarca: number,
  modelo: string): Observable<any> {
    let params=new HttpParams()
            .set('id', id.toString())
            .set('idmarca', idmarca.toString())
            .set('modelo', modelo.toString());
            console.log(params);
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(this.url + 'productomodelo/update.php', params, {headers: headers});
  }

  SeleccionarModelo(
    id: number
  ): Observable<any[]> {
    return this.http.get(this.url + 'productomodelo/readxId.php', {
      params: new HttpParams()
      .set('id', id.toString())
    })
    .pipe(map(res=>{
      if (res['codigo'] === 0){
        return res = res['data'];
      } else {
        // console.log('No hay datos que mostrar');
      }
    }));
  }

  ListarTipoDocumento( ):  Observable<TipoDocumento>
  {
    return this.http.get(this.url + 'tipodocumento/read.php')
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].tipodocumento;
      } else {
        // console.log('No hay datos que mostrar');
      }
    }));
  }

  EliminarModelo(id:number):Observable<any>{
    let params = new HttpParams().set('idmodelo',id.toString());
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this.http.post(this.url + 'productomodelo/delete.php', params, {headers: headers});

  }

  ListarInstitucion(
  ):  Observable<any> {
      return this.http.get(this.url + 'institucion/read.php')
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].institucion;
      } else {
        return []
        // console.log('No hay datos que mostrar');
      }
    }));
  }

  ListarSede(
    id_institucion: number,
    sd_nombre: string
  ): Observable<Sede>	{
      return this.http.get(this.url + 'sede/read.php?id_institucion=' + id_institucion + '&sd_nombre' + sd_nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
        return res['data'].sede;
    } else {
      return []
       // console.log('No hay datos que mostrar');
    }
  }));
  }

  ListarSubsede(
  id_sede: number,
  ssd_nombre: string
    ): Observable<Sede> {
      return this.http.get(this.url + 'subsede/read.php?id_sede=' + id_sede + '&ssd_nombre' + ssd_nombre)
      .pipe(map(res => {
      if (res['codigo'] === 0 ) {
          return res['data'].subsede;
      } else {
        return []
          // console.log('No hay datos que mostrar');
        }
    }));
  }

  ListarAlmacen(): Observable<Almacen[]> {
    return this.http.get(this.url + 'almacen/read.php')
    .pipe(map(res => {
      if (res['codigo'] === 0) {
        return res['data'].almacenes;
      } else {
        return []
        // console.log('No hay datos que mostrar');
        }
    }));
  }

  ListarTransaccionTipo (
    tipo:string //1. Ingreso, 2 Salida
  ): Observable <any> {
    return this.http.get(this.url + 'transacciontipo/read.php', {
      params: new HttpParams()
      .set('prid', tipo)
    })

    .pipe(map(res => {
      if (res['codigo'] === 0) {
          return res['data'].tipos;
      } else {
        return []
          // console.log('No hay datos que mostrar');
        }
    }));
  }

  ListarProveedor(
     nombre: string
    ): Observable <any> {
      return this.http.get(this.url + 'proveedor/read.php', {
        params: new  HttpParams()
        .set('prnombre', nombre)
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {

            return res['data'].proveedor;
          } else {
            return []
              // console.log ('No hay datos que mostrar');
          }
      }));
      }

    ListarCliente(
    nombre: string
    ): Observable <any> {
      return this.http.get(this.url + 'cliente/read.php', {
        params: new  HttpParams()
        .set('pclt_nombre', nombre)
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {
            return res['data'].clientes;
          } else {
            return []
              // console.log ('No hay datos que mostrar');
          }
      }));
    }

    ListarSucursal(
      id: number,
      nombre: string
    ): Observable<any> {

      let ID: string;

      if (id == null ) {
        ID = "";
      } else {
        ID = id.toString();
      }

      return this.http.get(this.url + 'sucursal/read.php', {
        params: new HttpParams()
        .set('prid', ID)
        .set('prnombre', nombre)
      })

      .pipe(map(res => {
        if (res['codigo'] === 0) {
            return res['data'].sucursal;
        } else {
          return []
          // console.log('No hay datos que mostrar');
        }
      }));
    }

    ListarProductoEnSucursal(
      id_sucursal:number,
      producto:string
    ): Observable<any> {

      return this.http.get(this.url + 'producto/read-sucursal.php', {
        params: new HttpParams()
        .set('prsucursal', id_sucursal.toString())
        .set('prnombre', producto)
      })

      .pipe(map(res => {
        if (res['codigo'] === 0) {
            return res['data'].productos;
        } else {
          return []
          // console.log('No hay datos que mostrar');
        }
      }));
    } 

    ListarVendedor(
      dni:string,
      nombre: string,
      sucursal: string,
      pagina: number,
      total_pagina:number
    ): Observable <any> {

      let params = new HttpParams()
        .set('prdocumento',dni)
        .set('prnombre',nombre)
        .set('prsucursal',sucursal)
        .set('prpagina',pagina.toString())
        .set('prtotalpagina',total_pagina.toString())

      return this.http.get(this.url + 'vendedor/read.php', {params})
        .pipe(map(res => {
            if (res['codigo'] === 0) {
              return res['data'].vendedores;
            } else {
              return []
              // console.log ('No hay datos que mostrar');
            }
        })
      );
    }

    ListarProductos(
      nombre: string
      ): Observable <any> {
        return this.http.get(this.url + 'producto/read.php', {
          params: new  HttpParams()
          .set('prdescripcion', nombre)

        })
        .pipe(map(res => {
            if (res['codigo'] === 0) {
              return res['data'].productos;
            } else {
              return []
                // console.log ('No hay datos que mostrar');
            }
        }));
    }

    ListarNumeroTalonario(prserie: string): Observable <any> {
      return this.http.get(this.url + 'talonario/read-numero.php', {
        params: new  HttpParams()
        .set('prserie', prserie)
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {
            return res['data'].numeros;
          } else {
            return []
              // console.log ('No hay datos que mostrar');
          }
      }));
    }

    ListarSerie(): Observable <any> {
      return this.http.get(this.url + 'talonario/read-serie.php', {
        params: new  HttpParams()
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {
            return res['data'].series;
          } else {
            return []
              // console.log ('No hay datos que mostrar');
          }
      }));
    }

    ActualizarEstadoTalonario(
      id_talonario:number,
      estado: number, // 0. Inactivo, 1.Activo, 2. Utilizado, 3. Consignación
    ){

      let params = new HttpParams()
      .set('prid',id_talonario.toString())
      .set('prestado',estado.toString());
      
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  
      return this.http.post(this.url + 'talonario/update-estado.php', params, {headers: headers});
    }

    SeleccionarTalonario(
      prid: number
    ): Observable <any> {
      return this.http.get(this.url + 'talonario/readxId.php', {
        params: new  HttpParams()
        .set('prid', prid.toString())
      })
      .pipe(map(res => {
          if (res['codigo'] === 0) {
            return res['data'];
          } else {
            return []
              // console.log ('No hay datos que mostrar');
          }
      }));
    }

    ListarCourier(
      nombre : string,
      pagina: number,
      total_pagina : number
    ){
      let params = new HttpParams()
        .set('prnombre', nombre)
        .set('prpagina', pagina.toString())
        .set('prtotalpagina', total_pagina.toString())

      return this.http.get(this.url + 'courier/read.php', { params })
      .pipe(
        map((res)=>{
          if (res['codigo'] === 0) {
            return res;
          } else {
            return res
              // console.log ('No hay datos que mostrar');
          }
        }
      ))

    }

    SeleccionarCourier(
      id : number 
    ){
      let params = new HttpParams()
        .set('prid', id.toString());

      return this.http.get(this.url + 'courier/readxId.php', { params })
      .pipe(map(res => {
        if (res['codigo'] === 0) {
          return res['data'];
        } else {
          return []
            // console.log ('No hay datos que mostrar');
        }
      }));
    }

    CrearCourier(
      nombre : string,
      url: string
    ){

      let params = new HttpParams()
        .set('prnombre',nombre)
        .set('prurl',url);
      
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  
      return this.http.post(this.url + 'courier/create.php', params, {headers: headers});
    }

    ActualizarCourier(
      id : number,
      nombre : string,
      url: string
    ){

      let params = new HttpParams()
        .set('prid',id.toString())
        .set('prnombre',nombre)
        .set('prurl',url);
      
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  
      return this.http.post(this.url + 'courier/update.php', params, {headers: headers});
    }

    EliminarCourier(
      id : number
    ){

      let params = new HttpParams()
        .set('prid',id.toString())
      
      let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  
      return this.http.post(this.url + 'courier/delete.php', params, {headers: headers});
    }

    RenameFile(
      nameimg: string,
      tipodoc: string,
      numdoc: string,
      grupo:string
    ): Observable <any> {

      if (!nameimg) {
        return of({codigo:1, data:"",mensaje:""});
      }

      return this.http.get(this.url + 'file/rename.php', {
      params: new  HttpParams()
      .set('nameimg', nameimg.trim())
      .set('tipodoc', tipodoc.trim())
      .set('numdoc', numdoc.trim())
      .set('prgrupo',grupo.trim())
      })
      .pipe(map(res => {
        if (res['codigo'] === 0) {
          return res;
        } else {
          console.log ('No hay datos que mostrar');
          return [];
        }
      }));
    }

  }

export interface ListarProductos {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  descripcion: string;
  precio: number;
}

export interface ListarCliente {
id: number;
instnombre: string;
ssdNombre: string;
pcltDni: string;
pcltNombre: string;
}

export interface ListarVendedor {
id: number;
vndNombre: string;
scsNombre: string;
}

export interface TipoTransaccion {
  numero: number;
  id: number;
  nombre: string;

}

export interface Almacen {
  numero: number;
  id_almacen: number;
  Alm_nombre: string;
}

export interface TipoProductoModelo {
  numero: number;
  id: number;
  nombre: string;
  unidad_medida: string;
}

export interface MarcaModelo {
  numero: number;
  id: number;
  tipo: string;
  nombre: string;
}

export interface ModeloModelo {
  numero: number;
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  nombre: string;
}

export interface Subsede {
  numero: number;
  id: number;
  nombre: string;
}

export interface Sede {
  numero: number;
  id: number;
  nombre: string;
}

export interface TipoDocumento {
 
  id: number;
  nombre: string;
}

export interface Institucion {
  numero: number;
  id: number;
  nombre: string;
}

export interface Talonario {
  id: number;
  serie: number;
  numero: number;
}

export interface Serie {
  serie: number;
}

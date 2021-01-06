import {Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { EstadosGlobales } from 'src/app/compartido/reducers/estados';
import { Rol } from 'src/app/compartido/modelos/login.modelos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css'],
  providers: []
})
export class MenuComponent implements OnInit{

  public Menu: Menu[];

  constructor(
    private _router : Router ,
    private _store : Store<EstadosGlobales> ,
  ) { }

  ngOnInit(){
    this._store.select('permisos').subscribe(permiso =>{
      if ( permiso ) {
        this.CrearMenu(permiso) ;
      } else {
      }
    })
  }

  CrearRecuperacion(){
    this.Menu=[
      {
        nombre: "Tablas maestras",
        icono: "table_chart",
        mostrar : true ,
        path : "tablas-maestras" ,
        submenu:[
          {
            nombre: "Usuarios",
            path: "usuarios",
            mostrar : true ,
          },
        ]
      },
    ]
  }

  CrearMenu( permiso : Rol ) {
    this.Menu=[
      // Maestro general
      {
        nombre: "Maestro general",
        icono: "person",
        path: 'clientes',
        mostrar: true,
        submenu:[
          {
            nombre: "Clientes",
            path: "listado",
            mostrar : true ,
          },
          // {
          //   nombre: "Evaluación",
          //   path: "evaluacion"
          // },
          {
            nombre: "Transacciones",
            path: "evaluacion-express",
            mostrar : true ,
          },
          {
            nombre: "Presupuestos",
            path: "presupuesto",
            mostrar : false , // Se retiró por no uso 20-06-2020
          },
          {
            nombre: "Seguimiento de documentos",
            path: "seguimiento",
            mostrar : true ,
          },
        ]
      },
      // Ventas
      {
        nombre: "Ventas",
        icono: "store_mall_directory",
        path: 'ventas',
        mostrar: permiso.ventas.general,
        submenu:[

          {
            nombre: "Ventas",
            path: "ventas" ,
            mostrar : permiso.ventas.listado_ventas.general ,
          },
          {
            nombre: "Salida de ventas",
            path: "salidavendedores" ,
            mostrar : permiso.ventas.salida_ventas.general ,
          },
          {
            nombre: "Comisiones",
            path: "comisiones" ,
            mostrar : permiso.ventas.comision_vendedores.general ,
          }
        ]
      },
      // Inventarios
      {
        nombre: "Inventarios",
        icono: "domain",
        path: 'inventarios',
        mostrar: permiso.inventarios.general,
        submenu:[
          {
            nombre: "Productos",
            path: "detalleproductos" ,
            mostrar : permiso.inventarios.productos.general ,
          },
          {
            nombre: "Stock",
            path: "stock" ,
            mostrar : permiso.inventarios.stock.general ,
          },
          {
            nombre: "Historial de documentos",
            path: "movimientos" ,
            mostrar : permiso.inventarios.documentos_almacen.general ,
          },
          {
            nombre: "Historial de series",
            path: "series" ,
            mostrar : permiso.inventarios.historial_series.general ,
          }
        ]
      },
      // Créditos
      {
        nombre: "Créditos",
        icono: "account_balance",
        path: 'creditos',
        mostrar: permiso.creditos.general,
        submenu:[
          {
            nombre: "Préstamos",
            path: "creditos" ,
            mostrar : permiso.creditos.listado_creditos.general ,
          },
          {
            nombre: "Afiliaciones",
            path: "afiliaciones" ,
            mostrar : permiso.creditos.afiliaciones.general ,
          },
          {
            nombre: "Refinanciamientos",
            path: "refinanciamiento" ,
            mostrar : permiso.creditos.refinanciamientos.general ,
          },
        ]
      },
      // Juciales
      {
        nombre: "Judiciales",
        icono: "location_city",
        path: 'cobranzas',
        mostrar: permiso.procesos_judiciales.general,
        submenu:[
          {
            nombre: "Procesos judiciales",
            path: "cobranza-judicial" ,
            mostrar : permiso.procesos_judiciales.listado_procesos.general
          },
        ]
      },
      // Cobranzas
      {
        nombre: "Cobranzas",
        icono: "gavel",
        path: 'cobranzas',
        mostrar: permiso.cobranzas.general,
        submenu:[
          // {
          //   nombre: "Cronograma de pagos",
          //   path: "listado" ,
          //   mostrar : permiso.cobranzas.cronograma.general ,
          // },
          // {
          //   nombre: "Clientes morosos I",
          //   path: "listado-cliente" ,
          //   mostrar : permiso.cobranzas.clientes_morosos.general ,
          // },
          // {
          //   nombre: "Clientes muy morosos II",
          //   path: "listado-cliente-morosos" ,
          //   mostrar : permiso.cobranzas.clientes_morosos.general ,
          // },
          {
            nombre: "Cobranzas por planilla",
            path: "cobranza-archivos" ,
            mostrar : permiso.cobranzas.cobranzas_planilla.general ,
          },
          {
            nombre: "Cobranzas directas",
            path: "cobranza-directa" ,
            mostrar : permiso.cobranzas.cobranzas_directas.general ,
          },
          {
            nombre: "Cobranzas manuales",
            path: "cobranza-manual" ,
            mostrar : permiso.cobranzas.cobranzas_manuales.general ,
          },
          {
            nombre: "Cobranzas judiciales",
            path: "" ,
            mostrar : permiso.procesos_judiciales.listado_procesos.general ,
          },
          {
            nombre: "Liquidaciones",
            path: "liquidaciones" ,
            mostrar : permiso.cobranzas.cobranzas_directas.general ,
          },
        ]
      },
      // Reportes
      {
        nombre: "Reportes",
        icono: "dashboard",
        path: 'reportes',
        mostrar: permiso.cobranzas.general,
        submenu:[
          {
            nombre: "Clientes morosos I",
            path: "listado-cliente" ,
            mostrar : permiso.cobranzas.clientes_morosos.general ,
          },
          {
            nombre: "Clientes muy morosos II",
            path: "listado-cliente-morosos" ,
            mostrar : permiso.cobranzas.clientes_morosos.general ,
          },
          {
            nombre: "Registro usuarios",
            path: "registro-usuarios" ,
            mostrar : permiso.tablas_maestras.usuarios ,
          },
        ]
      },
      // Asistencia
      // {
      //   nombre: "Asistencia",
      //   icono: "access_alarms",
      //   path: "aistencia",
      //   disabled:false,
      //   submenu:[
      //     {
      //       nombre: "Trabajadores",
      //       path: "trabajadores"
      //     },
      //     {
      //       nombre: "Registro",
      //       path: "registro-horas"
      //     },
      //     {
      //       nombre: "Reporte",
      //       path: "reporte-asistencia"
      //     },
      //   ]
      // },
      // Tablas maestras
      {
        nombre: "Tablas maestras",
        icono: "table_chart",
        path: 'maestro',
        mostrar: permiso.tablas_maestras.general ,
        submenu:[
          {
            nombre: "Cooperativa",
            path: "configuracion",
            mostrar : permiso.tablas_maestras.cooperativa ,
          },
          {
            nombre: "Usuarios",
            path: "usuarios",
            mostrar : permiso.tablas_maestras.usuarios ,
          },
          {
            nombre: "Bancos",
            path: "bancos",
            mostrar : permiso.tablas_maestras.bancos ,
          },
          {
            nombre: "Departamentos",
            path: "direcciones",
            mostrar : permiso.tablas_maestras.direcciones ,
          },
          {
            nombre: "Instituciones",
            path: "instituciones",
            mostrar : permiso.tablas_maestras.instituciones ,
          },
          {
            nombre: "Centros de trabajo",
            path: "centros-trabajo",
            mostrar : permiso.tablas_maestras.direcciones ,
          },
          {
            nombre: "Procesos judiciales",
            path: "proceso-judicial-vinculados",
            mostrar : permiso.tablas_maestras.procesos_judiciales ,
          },
          {
            nombre: "Plantillas",
            path: "plantillas",
            mostrar : permiso.tablas_maestras.plantillas ,
          },
          {
            nombre: "Proveedores",
            path: "proveedores",
            mostrar : permiso.tablas_maestras.proveedores ,
          },
          {
            nombre: "Talonarios / Contratos",
            path: "talonarios",
            mostrar : permiso.tablas_maestras.talonarios ,
          },
          {
            nombre: "Trabajadores",
            path: "trabajadores",
            mostrar : permiso.tablas_maestras.trabajadores ,
          },
        ]
      },
    ]
  }

  Navegar(path_principal : string , path_secundario: string) {
    this._router.navigate([path_principal, path_secundario])
  }

}

export interface Menu{
  nombre: string ,
  icono:string ,
  mostrar:boolean ,
  path : string ,
  submenu: Submenu[]
}

export interface Submenu{
  nombre:string,
  path:string,
  mostrar : boolean
}
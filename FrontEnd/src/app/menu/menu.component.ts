import {Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { EstadoSesion } from '../components/usuarios/usuarios.reducer';
import { Rol } from '../components/usuarios/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css'],
  providers: []
})
export class MenuComponent implements OnInit{

  public Menu: Menu[];

  constructor(
    private _store : Store<EstadoSesion> ,
  ) { }

  ngOnInit(){
    this._store.select('permisos').subscribe(permiso =>{
      if ( permiso ) {
        this.CrearMenu(permiso) ;
      }
    })
  }

  CrearMenu( permiso : Rol ) {
    this.Menu=[
      // Maestro general
      {
        nombre: "Maestro general",
        icono: "person",
        mostrar: true,
        submenu:[
          {
            nombre: "Clientes",
            path: "clientes",
            mostrar : true ,
          },
          // {
          //   nombre: "Evaluación",
          //   path: "evaluacion"
          // },
          {
            nombre: "Evaluación",
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
        mostrar: permiso.inventarios.general,
        submenu:[
          {
            nombre: "Productos",
            path: "productos" ,
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
        mostrar: permiso.cobranzas.general,
        submenu:[
          {
            nombre: "Cronograma de pagos",
            path: "cobranzas" ,
            mostrar : permiso.cobranzas.cronograma.general ,
          },
          {
            nombre: "Clientes morosos I",
            path: "cobranzas-cliente" ,
            mostrar : permiso.cobranzas.clientes_morosos.general ,
          },
          {
            nombre: "Clientes muy morosos II",
            path: "cobranzas-cliente-morosos" ,
            mostrar : permiso.cobranzas.clientes_morosos.general ,
          },
          {
            nombre: "Cobranzas directas",
            path: "cobranza-directa" ,
            mostrar : permiso.cobranzas.cobranzas_directas.general ,
          },
          {
            nombre: "Cobranzas por planilla",
            path: "cobranza-archivos" ,
            mostrar : permiso.cobranzas.cobranzas_planilla.general ,
          },
          {
            nombre: "Cobranzas manuales",
            path: "cobranza-manual" ,
            mostrar : permiso.cobranzas.cobranzas_manuales.general ,
          },
        ]
      },
      // Asistencia
      // {
      //   nombre: "Asistencia",
      //   icono: "access_alarms",
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
        mostrar: permiso.tablas_maestras.general ,
        submenu:[
          {
            nombre: "Usuarios",
            path: "usuarios",
            mostrar : permiso.tablas_maestras.usuarios ,
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
            nombre: "Productos",
            path: "detalleproductos",
            mostrar : permiso.tablas_maestras.productos ,
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

}

export interface Menu{
  nombre: string,
  icono:string,
  mostrar:boolean,
  submenu: Submenu[]
}

export interface Submenu{
  nombre:string,
  path:string,
  mostrar : boolean
}
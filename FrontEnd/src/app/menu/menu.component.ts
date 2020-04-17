import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css'],
  providers: []
})
export class MenuComponent implements OnInit{

  public menu: Menu[];

  constructor( ) {
  }

  ngOnInit(){
    this.menu=[
      // Maestro general
      {
        nombre: "Maestro general",
        icono: "person",
        disabled:false,
        submenu:[
          {
            nombre: "Clientes",
            path: "clientes"
          },
          // {
          //   nombre: "Evaluación",
          //   path: "evaluacion"
          // },
          {
            nombre: "Evaluación",
            path: "evaluacion-express"
          },
          {
            nombre: "Presupuestos",
            path: "presupuesto"
          },
          {
            nombre: "Seguimiento de documentos",
            path: "seguimiento"
          },
        ]
      },
      // Ventas
      {
        nombre: "Ventas",
        icono: "store_mall_directory",
        disabled:false,
        submenu:[

          {
            nombre: "Ventas",
            path: "ventas"
          },
          {
            nombre: "Salida de ventas",
            path: "salidavendedores"
          },
          {
            nombre: "Comisiones",
            path: "comisiones"
          }
        ]
      },
      // Inventarios
      {
        nombre: "Inventarios",
        icono: "domain",
        disabled:false,
        submenu:[
          {
            nombre: "Productos",
            path: "productos"
          },
          {
            nombre: "Stock",
            path: "stock"
          },
          {
            nombre: "Historial de documentos",
            path: "movimientos"
          },
          {
            nombre: "Historial de series",
            path: "series"
          }
        ]
      },
      // Créditos
      {
        nombre: "Créditos",
        icono: "account_balance",
        disabled:false,
        submenu:[
          {
            nombre: "Préstamos",
            path: "creditos"
          },
          {
            nombre: "Afiliaciones",
            path: "afiliaciones"
          },
          {
            nombre: "Refinanciamientos",
            path: "refinanciamiento"
          },
        ]
      },
      // Juciales
      {
        nombre: "Judiciales",
        icono: "location_city",
        disabled:false,
        submenu:[
          {
            nombre: "Procesos judiciales",
            path: "cobranza-judicial"
          },
        ]
      },
      // Cobranzas
      {
        nombre: "Cobranzas",
        icono: "gavel",
        disabled:false,
        submenu:[
          {
            nombre: "Cronograma de pagos",
            path: "cobranzas"
          },
          {
            nombre: "Clientes morosos I",
            path: "cobranzas-cliente"
          },
          {
            nombre: "Clientes muy morosos II",
            path: "cobranzas-cliente-morosos"
          },
          {
            nombre: "Cobranzas directas",
            path: "cobranza-directa"
          },
          {
            nombre: "Cobranzas por planilla",
            path: "cobranza-archivos"
          },
        ]
      },
      // Asistencia
      {
        nombre: "Asistencia",
        icono: "access_alarms",
        disabled:false,
        submenu:[
          {
            nombre: "Trabajadores",
            path: "trabajadores"
          },
          {
            nombre: "Registro",
            path: "registro-horas"
          },
          {
            nombre: "Reporte",
            path: "reporte-asistencia"
          },
        ]
      },
      // Tablas maestras
      {
        nombre: "Tablas maestras",
        icono: "table_chart",
        disabled:false,
        submenu:[
          {
            nombre: "Usuarios",
            path: "usuarios"
          },
          {
            nombre: "Direcciones",
            path: "direcciones"
          },
          {
            nombre: "Instituciones",
            path: "instituciones"
          },
          {
            nombre: "Procesos judiciales",
            path: "proceso-judicial-vinculados"
          },
          {
            nombre: "Plantillas",
            path: "plantillas"
          },
          {
            nombre: "Productos",
            path: "detalleproductos"
          },
          {
            nombre: "Proveedores",
            path: "proveedores"
          },
          {
            nombre: "Talonarios",
            path: "talonarios"
          },
          {
            nombre: "Vendedores",
            path: "vendedores"
          },
        ]
      },
    ]
  }

}

export interface Menu{
  nombre: string,
  icono:string,
  disabled:boolean,
  submenu: Submenu[]
}

export interface Submenu{
  nombre:string,
  path:string,
}
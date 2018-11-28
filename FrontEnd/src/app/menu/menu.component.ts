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
      // {
      //   nombre: "Inicio",
      //   icono: "home",
      //   disabled:false,
      //   submenu:[]
      // },
      {
        nombre: "Ventas",
        icono: "store_mall_directory",
        disabled:false,
        submenu:[
          {
            nombre: "Clientes",
            path: "clientes"
          },
          {
            nombre: "Evaluación",
            path: "evaluacion"
          },
          {
            nombre: "Ventas",
            path: "ventas"
          },
          {
            nombre: "Devoluciones",
            path: "devoluciones"
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
      {
        nombre: "Créditos",
        icono: "account_balance",
        disabled:true,
        submenu:[]
      },
      {
        nombre: "Cobranzas",
        icono: "gavel",
        disabled:true,
        submenu:[]
      },
      {
        nombre: "Tablas maestras",
        icono: "table_chart",
        disabled:false,
        submenu:[
          {
            nombre: "Cooperativa",
            path: ""
          },
          {
            nombre: "Proveedores",
            path: "proveedores"
          },
          {
            nombre: "Productos",
            path: "detalleproductos"
          },
          {
            nombre: "Instituciones",
            path: ""
          }
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

/*

const TREE_DATA = JSON.stringify({
  'Administración del sistema': {
    Usuarios: 'usuarios',
    Proveedores: 'proveedores',
    Cooperativa: {
      'Aportes de socio': '',
      'Cuentas bancarias': ''
    },
    'Tipo de cambio': '',
    'Tablas maestras': {
      'Bancos': '',
      'Condición laboral': '',
      'Detalle de productos': 'detalleproductos',
      'Direcciones': 'direcciones',
      'Instituciones': '',
      'Sucursales': '',
    }
  }
});
*/
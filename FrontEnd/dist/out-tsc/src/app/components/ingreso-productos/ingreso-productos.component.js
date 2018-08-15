"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var servicios_1 = require("./../global/servicios");
var ventanaseries_1 = require("./ventana-series/ventanaseries");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var rxjs_1 = require("rxjs");
var material_1 = require("@angular/material");
var operators_1 = require("rxjs/operators");
var moment = require("moment");
var IngresoProductosComponent = /** @class */ (function () {
    function IngresoProductosComponent(DialogoSerie, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, 
    /* public data,*/
    Servicios) {
        this.DialogoSerie = DialogoSerie;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
        this.almacenes = [];
        this.TipoIngresos = [];
        this.proveedores = [];
        this.selected = 'option2';
        this.myControl = new forms_1.FormControl();
    }
    IngresoProductosComponent.prototype.ngOnInit = function () {
        this.ListarAlmacen();
        this.ListarTransaccionTipo();
        this.ListarProveedor(' ');
        this.IngresoProductoForm = this.FormBuilder.group({
            'almacen': [null, [forms_1.Validators.required]],
            'tipoIngreso': [null, [forms_1.Validators.required]],
            'docReferencia': [null, [forms_1.Validators.required, forms_1.Validators.pattern('[0-9-]+')]],
            'proveedor': [null, [forms_1.Validators.required]],
            'fecingreso': [null, [forms_1.Validators.required]],
        });
        /*
              this.Servicios.ListarAlmacen().subscribe(res => {
                // tslint:disable-next-line:forin
               for (let i in res) {
                 this.Almacen.push(res [i]);
               }
             });
        */
        this.contador = 1;
        this.articulos = [
            { numero: this.contador, nombre: '', cantidad: null, precio: null }
        ];
    };
    // Selector Proveedores activos
    IngresoProductosComponent.prototype.ListarProveedor = function (nombre) {
        var _this = this;
        this.Servicios.ListarProveedor(nombre).subscribe(function (res) {
            _this.proveedores = [];
            console.log(res);
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.proveedores.push(res[i]);
            }
        });
    };
    // tslint:disable-next-line:use-life-cycle-interface
    IngresoProductosComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        rxjs_1.fromEvent(this.FiltroProveedor.nativeElement, 'keyup')
            .pipe(operators_1.debounceTime(10), operators_1.distinctUntilChanged(), operators_1.tap(function () {
            _this.ListarProveedor(_this.FiltroProveedor.nativeElement.value);
        })).subscribe();
    };
    // Selector tipo de ingresos
    IngresoProductosComponent.prototype.ListarTransaccionTipo = function () {
        var _this = this;
        this.Servicios.ListarTransaccionTipo().subscribe(function (res) {
            _this.TipoIngresos = [];
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.TipoIngresos.push(res[i]);
            }
        });
    };
    // Selector Almacenes Activos
    IngresoProductosComponent.prototype.ListarAlmacen = function () {
        var _this = this;
        this.Servicios.ListarAlmacen().subscribe(function (res) {
            _this.almacenes = [];
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.almacenes.push(res[i]);
            }
        });
    };
    IngresoProductosComponent.prototype.agregar = function () {
        this.contador++;
        this.articulos.push({ numero: this.contador, nombre: '', cantidad: null, precio: null });
    };
    IngresoProductosComponent.prototype.Aceptar = function () {
        console.log(this.articulos);
    };
    IngresoProductosComponent.prototype.AgregarSerie = function () {
        var serieventana = this.DialogoSerie.open(ventanaseries_1.ventanaseries, {
            width: '600px'
        });
    };
    IngresoProductosComponent.prototype.Guardar = function () {
        console.log(this.IngresoProductoForm);
        console.log(moment(this.IngresoProductoForm.get('fecingreso').value).format('DD/MM/YYYY'));
    };
    IngresoProductosComponent.prototype.Cambio = function (evento) {
        console.log(evento);
    };
    __decorate([
        core_1.ViewChild('Proveedor'),
        __metadata("design:type", core_1.ElementRef)
    ], IngresoProductosComponent.prototype, "FiltroProveedor", void 0);
    IngresoProductosComponent = __decorate([
        core_1.Component({
            selector: 'app-ingreso-productos',
            templateUrl: './ingreso-productos.component.html',
            styleUrls: ['./ingreso-productos.component.css'],
            providers: [servicios_1.ServiciosGenerales]
        }),
        __metadata("design:paramtypes", [material_1.MatDialog,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales])
    ], IngresoProductosComponent);
    return IngresoProductosComponent;
}());
exports.IngresoProductosComponent = IngresoProductosComponent;
//# sourceMappingURL=ingreso-productos.component.js.map
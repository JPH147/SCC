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
var ventanaseries_1 = require("./ventana-series/ventanaseries");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var operators_1 = require("rxjs/operators");
var collections_1 = require("@angular/cdk/collections");
var material_1 = require("@angular/material");
var IngresoProductosComponent = /** @class */ (function () {
    function IngresoProductosComponent(DialogoSerie) {
        this.DialogoSerie = DialogoSerie;
        this.selected = 'option2';
        this.myControl = new forms_1.FormControl();
        this.options = ['One', 'Two', 'Three'];
        this.displayedColumns = ['position', 'name', 'weight', 'symbol'];
        this.selection = new collections_1.SelectionModel(true, []);
        this.foods = [
            { value: 'steak-0', viewValue: 'Almacen Principal' },
            { value: 'pizza-1', viewValue: 'Almacen Dos' },
            { value: 'tacos-2', viewValue: 'Almacen Tres' }
        ];
    }
    IngresoProductosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filteredOptions = this.myControl.valueChanges
            .pipe(operators_1.startWith(''), operators_1.map(function (value) { return _this._filter(value); }));
        this.contador = 1;
        this.articulos = [
            { numero: this.contador, nombre: '', cantidad: null, precio: null }
        ];
    };
    IngresoProductosComponent.prototype._filter = function (value) {
        var filterValue = value.toLowerCase();
        return this.options.filter(function (option) { return option.toLowerCase().includes(filterValue); });
    };
    IngresoProductosComponent.prototype.isAllSelected = function () {
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    IngresoProductosComponent.prototype.masterToggle = function () {
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
    IngresoProductosComponent = __decorate([
        core_1.Component({
            selector: 'app-ingreso-productos',
            templateUrl: './ingreso-productos.component.html',
            styleUrls: ['./ingreso-productos.component.css'],
        }),
        __metadata("design:paramtypes", [material_1.MatDialog])
    ], IngresoProductosComponent);
    return IngresoProductosComponent;
}());
exports.IngresoProductosComponent = IngresoProductosComponent;
//# sourceMappingURL=ingreso-productos.component.js.map
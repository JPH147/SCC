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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var forms_1 = require("@angular/forms");
var servicios_1 = require("../../global/servicios");
var operators_1 = require("rxjs/operators");
var collections_1 = require("@angular/cdk/collections");
var VentanaEmergenteDet = /** @class */ (function () {
    function VentanaEmergenteDet(data, ventana, 
    // tslint:disable-next-line:no-shadowed-variable
    FormBuilder, Servicios) {
        this.data = data;
        this.ventana = ventana;
        this.FormBuilder = FormBuilder;
        this.Servicios = Servicios;
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
    VentanaEmergenteDet.prototype.onNoClick = function () {
        this.ventana.close();
    };
    // tslint:disable-next-line:use-life-cycle-interface
    VentanaEmergenteDet.prototype.ngOnInit = function () {
        var _this = this;
        this.filteredOptions = this.myControl.valueChanges
            .pipe(operators_1.startWith(''), operators_1.map(function (value) { return _this._filter(value); }));
        this.contador = 1;
        this.articulos = [
            { numero: this.contador, nombre: '', cantidad: null, precio: null }
        ];
        //  private _filter(value: string): string[] {
        //    const filterValue = value.toLowerCase();
        //  return this.options.filter(option => option.toLowerCase().includes(filterValue));
    };
    VentanaEmergenteDet.prototype.isAllSelected = function () {
    };
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    VentanaEmergenteDet.prototype.masterToggle = function () {
    };
    VentanaEmergenteDet.prototype.agregar = function () {
        this.contador++;
        this.articulos.push({ numero: this.contador, nombre: '', cantidad: null, precio: null });
    };
    VentanaEmergenteDet.prototype.Aceptar = function () {
        console.log(this.articulos);
    };
    VentanaEmergenteDet.prototype.AgregarSerieSalida = function () {
        // const serieventana = this.DialogoSerie.open(ventanaseriesalida, {
        // width: '600px'
    };
    VentanaEmergenteDet = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergentedet',
            templateUrl: './ventanaemergentedet.html',
            styleUrls: ['./ventanaemergentedet.css'],
            providers: [servicios_1.ServiciosGenerales]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, material_1.MatDialogRef,
            forms_1.FormBuilder,
            servicios_1.ServiciosGenerales])
    ], VentanaEmergenteDet);
    return VentanaEmergenteDet;
}());
exports.VentanaEmergenteDet = VentanaEmergenteDet;
//# sourceMappingURL=ventanaemergentedet.js.map
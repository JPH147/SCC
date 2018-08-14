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
var productoserie_1 = require("../../global/productoserie");
var VentanaEmergenteStock = /** @class */ (function () {
    function VentanaEmergenteStock(data, Servicios) {
        this.data = data;
        this.Servicios = Servicios;
        this.LstSerie = [];
        this.Columnas = ['numero', 'producto', 'serie'];
    }
    VentanaEmergenteStock.prototype.ngOnInit = function () {
        this.contador = 1;
        this.seriearticulo = [{ numero: this.contador, series: '' }];
        this.ListarProductoSerie();
    };
    VentanaEmergenteStock.prototype.ListarProductoSerie = function () {
        var _this = this;
        this.Servicios.Listado(this.data).subscribe(function (res) {
            console.log(_this.data);
            _this.LstSerie = [];
            // tslint:disable-next-line:forin
            for (var i in res) {
                _this.LstSerie.push(res[i]);
            }
        });
    };
    VentanaEmergenteStock.prototype.AgregarSerieVS = function () {
        this.contador++;
        this.seriearticulo.push({ numero: this.contador, series: '' });
    };
    VentanaEmergenteStock.prototype.Aceptar = function () {
        console.log(this.seriearticulo);
    };
    VentanaEmergenteStock = __decorate([
        core_1.Component({
            selector: 'app-ventanaemergentestock',
            templateUrl: './ventanaemergentestock.html',
            styleUrls: ['./ventanaemergentestock.css'],
            providers: [productoserie_1.ServiciosProductoSerie]
        })
        // tslint:disable-next-line:component-class-suffix
        ,
        __param(0, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object, productoserie_1.ServiciosProductoSerie])
    ], VentanaEmergenteStock);
    return VentanaEmergenteStock;
}());
exports.VentanaEmergenteStock = VentanaEmergenteStock;
//# sourceMappingURL=ventanaemergentestock.js.map
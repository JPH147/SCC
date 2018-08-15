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
var core_1 = require("@angular/core");
var ELEMENT_DATA = [
    // tslint:disable-next-line:max-line-length
    { position: 1, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 101, nroContrato: 5644, fecVenta: '15/06/2018', montoVenta: 1500, nroCuota: 12 },
    // tslint:disable-next-line:max-line-length
    { position: 2, nomCliente: 'Jean Pierre', apeCliente: 'Rodriguez Farfan', talonario: 201, nroContrato: 5654, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 12 },
    // tslint:disable-next-line:max-line-length
    { position: 3, nomCliente: 'Eduardo', apeCliente: 'Rodriguez Garcia', talonario: 501, nroContrato: 5674, fecVenta: '15/06/2018', montoVenta: 1800, nroCuota: 18 },
    // tslint:disable-next-line:max-line-length
    { position: 4, nomCliente: 'Ivan', apeCliente: 'Arones Castro', talonario: 801, nroContrato: 5644, fecVenta: '15/06/2018', montoVenta: 3500, nroCuota: 12 },
    // tslint:disable-next-line:max-line-length
    { position: 5, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 101, nroContrato: 5694, fecVenta: '15/06/2018', montoVenta: 1000, nroCuota: 24 },
    // tslint:disable-next-line:max-line-length
    { position: 6, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 651, nroContrato: 5649, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 18 },
    // tslint:disable-next-line:max-line-length
    { position: 7, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 301, nroContrato: 5654, fecVenta: '15/06/2018', montoVenta: 3500, nroCuota: 24 },
    // tslint:disable-next-line:max-line-length
    { position: 8, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 451, nroContrato: 5659, fecVenta: '15/06/2018', montoVenta: 1000, nroCuota: 12 },
    // tslint:disable-next-line:max-line-length
    { position: 9, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 751, nroContrato: 5641, fecVenta: '15/06/2018', montoVenta: 2100, nroCuota: 18 },
    // tslint:disable-next-line:max-line-length
    { position: 10, nomCliente: 'Fernando', apeCliente: 'Martinez Arevalos', talonario: 901, nroContrato: 5674, fecVenta: '15/06/2018', montoVenta: 2500, nroCuota: 24 }
];
var ELEMENT_DATA1 = [
    { position1: 1, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 2, producto: 'Televisor', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 3, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 4, producto: 'Computadora', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 5, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 6, producto: 'Celuelar', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 7, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 8, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 9, producto: 'Celular', cantidad: 5, serie: 'ZX121343FG45656', confirma: ' ', obs: '' },
    { position1: 10, producto: 'Libro', cantidad: 5, serie: ' ', confirma: ' ', obs: '' },
];
var ELEMENT_DATA2 = [
    { position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '', obs2: '' },
    { position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '', obs2: '' },
    { position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '', obs2: '' },
    { position2: 1, seriet: 101, inicio: 501, fin: 550, confirmar: '', obs2: '' },
];
var RetornoVendedoresComponent = /** @class */ (function () {
    function RetornoVendedoresComponent() {
        this.dataSource = ELEMENT_DATA;
        this.displayedColumns = ['position', 'nomCliente', 'apeCliente', 'talonario', 'nroContrato', 'fecVenta', 'montoventa', 'nroCuota'];
        this.dataSource1 = ELEMENT_DATA1;
        this.displayedColumns1 = ['position1', 'producto', 'cantidad', 'serie', 'confirma', 'obs'];
        this.dataSource2 = ELEMENT_DATA2;
        this.displayedColumns2 = ['position2', 'seriet', 'inicio', 'fin', 'confirmar', 'obs2'];
    }
    RetornoVendedoresComponent.prototype.ngOnInit = function () {
    };
    RetornoVendedoresComponent = __decorate([
        core_1.Component({
            selector: 'app-retorno-vendedores',
            templateUrl: './retorno-vendedores.component.html',
            styleUrls: ['./retorno-vendedores.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], RetornoVendedoresComponent);
    return RetornoVendedoresComponent;
}());
exports.RetornoVendedoresComponent = RetornoVendedoresComponent;
//# sourceMappingURL=retorno-vendedores.component.js.map
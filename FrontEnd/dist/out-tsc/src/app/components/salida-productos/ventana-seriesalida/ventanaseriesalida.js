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
var ventanaseriesalida = /** @class */ (function () {
    function ventanaseriesalida() {
    }
    ventanaseriesalida.prototype.ngOnInit = function () {
        this.contador = 1;
        this.seriearticulo = [{ numero: this.contador, series: '' }];
    };
    ventanaseriesalida.prototype.AgregarSerieVSalida = function () {
        this.contador++;
        this.seriearticulo.push({ numero: this.contador, series: '' });
    };
    ventanaseriesalida.prototype.Aceptar = function () {
        console.log(this.seriearticulo);
    };
    ventanaseriesalida = __decorate([
        core_1.Component({
            selector: 'app-ventanaseriesalida',
            templateUrl: './ventanaseriesalida.html',
            styleUrls: ['./ventanaseriesalida.css']
        })
        // tslint:disable-next-line:class-name
        ,
        __metadata("design:paramtypes", [])
    ], ventanaseriesalida);
    return ventanaseriesalida;
}());
exports.ventanaseriesalida = ventanaseriesalida;
//# sourceMappingURL=ventanaseriesalida.js.map
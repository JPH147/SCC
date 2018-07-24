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
var http_1 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var url_1 = require("../global/url");
var VentaService = /** @class */ (function () {
    function VentaService(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    VentaService.prototype.Listado = function (fechainicio, monto, numerocuotas) {
        return this.http.get(this.url + 'cronograma/create.php?fechainicio='
            + fechainicio + '&monto=' + monto + '&numerocuotas=' + numerocuotas)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].cuotas;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    VentaService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], VentaService);
    return VentaService;
}());
exports.VentaService = VentaService;
//# sourceMappingURL=ventas.service.js.map
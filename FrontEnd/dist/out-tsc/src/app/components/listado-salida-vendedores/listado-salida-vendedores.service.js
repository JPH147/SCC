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
var moment = require("moment");
var ListadoSalidaVendedoresService = /** @class */ (function () {
    function ListadoSalidaVendedoresService(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    ListadoSalidaVendedoresService.prototype.Listado = function (pecosa, sucursal, fecha_inicio, fecha_fin, destino, estado, pagina, total_pagina, orden) {
        var Pecosa, Sucursal, Estado, Finicio, Ffin;
        if (!fecha_inicio) {
            Finicio = "";
        }
        else {
            Finicio = moment(fecha_inicio, "DD/MM/YYYY").format("YYYY/MM/DD").toString();
        }
        if (!fecha_fin) {
            Ffin = "";
        }
        else {
            Ffin = moment(fecha_fin, "DD/MM/YYYY").format("YYYY/MM/DD").toString();
        }
        if (pecosa == null) {
            Pecosa = "";
        }
        else {
            Pecosa = pecosa.toString();
        }
        if (sucursal == null) {
            Sucursal = "";
        }
        else {
            Sucursal = sucursal.toString();
        }
        if (estado == null) {
            Estado = "";
        }
        else {
            Estado = estado.toString();
        }
        console.log(Pecosa, Sucursal, Estado, Finicio, Ffin, destino, pagina, total_pagina, orden);
        return this.http.get(this.url + 'salidacabecera/read.php', {
            params: new http_1.HttpParams()
                .set('prpecosa', Pecosa)
                .set('prtipo', Sucursal)
                .set('prfechainicio', Finicio)
                .set('prfechafin', Ffin)
                .set('prdestino', destino)
                .set('prestado', Estado)
                .set('prpagina', pagina.toString())
                .set('prtotalpagina', total_pagina.toString())
                .set('orden', orden)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
                return res;
            }
        }));
    };
    ListadoSalidaVendedoresService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ListadoSalidaVendedoresService);
    return ListadoSalidaVendedoresService;
}());
exports.ListadoSalidaVendedoresService = ListadoSalidaVendedoresService;
//# sourceMappingURL=listado-salida-vendedores.service.js.map
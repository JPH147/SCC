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
var ProductoService = /** @class */ (function () {
    function ProductoService(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    ProductoService.prototype.Listado = function (tipo, marca, modelo, descripcion, pagina, total_pagina, columna, tipo_orden) {
        var orden;
        orden = columna.concat(' ', tipo_orden);
        return this.http.get(this.url + 'producto/read.php', {
            params: new http_1.HttpParams()
                .set('prtipo', tipo)
                .set('prmarca', marca)
                .set('prmodelo', modelo)
                .set('prdescripcion', descripcion)
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
    ProductoService.prototype.Eliminar = function (producto) {
        // tslint:disable-next-line:prefer-const
        var params = 'idproducto=' + producto;
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'producto/delete.php', params, { headers: headers });
    };
    ProductoService.prototype.Agregar = function (modelo, descripcion, precio) {
        // tslint:disable-next-line:prefer-const
        var params = 'id_modelo=' + modelo + '&prd_descripcion=' + descripcion + '&prd_precio=' + precio;
        // tslint:disable-next-line:prefer-const
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'producto/create.php', params, { headers: headers });
    };
    ProductoService.prototype.Seleccionar = function (id) {
        return this.http.get(this.url + 'producto/readxId.php?id_producto=' + id)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'];
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ProductoService.prototype.Actualizar = function (id, modelo, descripcion, precio) {
        // tslint:disable-next-line:prefer-const
        // tslint:disable-next-line:whitespace
        // tslint:disable-next-line:prefer-const
        var params = 'id_producto=' + id + '&id_modelo= ' + modelo + '&prd_descripcion = ' + descripcion + '&prd_precio=' + precio;
        // tslint:disable-next-line:prefer-const
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'producto/update.php', params, { headers: headers });
    };
    ProductoService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ProductoService);
    return ProductoService;
}());
exports.ProductoService = ProductoService;
//# sourceMappingURL=productos.service.js.map
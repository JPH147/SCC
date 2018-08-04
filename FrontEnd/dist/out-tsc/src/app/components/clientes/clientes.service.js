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
var ClienteService = /** @class */ (function () {
    function ClienteService(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    ClienteService.prototype.Listado = function (inst_nombre, sd_nombre, ssd_nombre, dni, nombre, apellido) {
        return this.http.get(this.url + 'cliente/read.php?inst_nombre='
            + inst_nombre + '&sd_nombre=' + sd_nombre + '&ssd_nombre='
            + ssd_nombre + '&pclt_dni=' + dni + '&pclt_nombre=' + nombre + '&pclt_apellido=' + apellido)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'].clientes;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ClienteService.prototype.Eliminar = function (idcliente) {
        var params = 'idcliente=' + idcliente;
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'cliente/delete.php', params, { headers: headers });
    };
    ClienteService.prototype.Agregar = function (id_institucion, clt_codigo, clt_dni, clt_nombre, clt_apellido, clt_cip, clt_email, clt_casilla, clt_trabajo, clt_cargo, clt_calificacion_crediticia, clt_calificacion_personal, clt_aporte) {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var params = 'id_institucion=' + id_institucion + '&clt_codigo=' + clt_codigo
            + '&clt_dni=' + clt_dni + '&clt_nombre=' + clt_nombre + '&clt_apellido=' + clt_apellido
            + '&clt_cip=' + clt_cip + '&clt_email=' + clt_email + '&clt_casilla=' + clt_casilla
            + '&clt_trabajo=' + clt_trabajo + '&clt_cargo=' + clt_cargo + '&clt_calificacion_crediticia=' + clt_calificacion_crediticia
            + '&clt_calificacion_personal=' + clt_calificacion_personal + '&clt_aporte=' + clt_aporte + '&clt_estado=1'
            + '&clt_fecharegistro=' + date;
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'cliente/create.php', params, { headers: headers });
    };
    ClienteService.prototype.Seleccionar = function (id) {
        return this.http.get(this.url + 'cliente/readxId.php?idcliente=' + id)
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res['data'];
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ClienteService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ClienteService);
    return ClienteService;
}());
exports.ClienteService = ClienteService;
//# sourceMappingURL=clientes.service.js.map
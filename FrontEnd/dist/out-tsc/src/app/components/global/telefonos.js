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
var url_1 = require("./url");
var ServiciosTelefonos = /** @class */ (function () {
    function ServiciosTelefonos(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    ServiciosTelefonos.prototype.CrearTelefono = function (id_cliente, tlf_numero, tlf_observacion, id_tipo, tlf_relevancia) {
        // tslint:disable-next-line:prefer-const
        var params = 'id_cliente=' + id_cliente + '&tlf_numero=' + tlf_numero
            + '&tlf_observacion=' + tlf_observacion + '&id_tipo=' + id_tipo
            + '&tlf_relevancia=' + tlf_relevancia;
        // tslint:disable-next-line:prefer-const
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        console.log(params);
        return this.http.post(this.url + 'clientetelefono/create.php', params, { headers: headers });
    };
    ServiciosTelefonos = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ServiciosTelefonos);
    return ServiciosTelefonos;
}());
exports.ServiciosTelefonos = ServiciosTelefonos;
//# sourceMappingURL=telefonos.js.map
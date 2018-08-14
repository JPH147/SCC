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
var VentasServicio = /** @class */ (function () {
    function VentasServicio(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    VentasServicio.prototype.Listado = function (cliente, tipo_venta, fecha_inicio, fecha_fin, pagina_inicio, pagina_final, orden) {
        var Tipo, Finicio, Ffin, Orden;
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
        if (tipo_venta == null) {
            Tipo = "";
        }
        else {
            Tipo = tipo_venta.toString();
        }
        return this.http.get(this.url + 'venta/read.php', {
            params: new http_1.HttpParams()
                .set('prcliente', cliente)
                .set('prtipo_venta', Tipo)
                .set('prfecha_inicio', Finicio)
                .set('prfecha_fin', Ffin)
                .set('prpagina', pagina_inicio.toString())
                .set('prtotalpagina', pagina_final.toString())
                .set('prorden', orden)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res;
            }
            else {
                console.log('Error al importar los datos, revisar servicio', res);
                return res;
            }
        }));
    };
    VentasServicio = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], VentasServicio);
    return VentasServicio;
}());
exports.VentasServicio = VentasServicio;
//# sourceMappingURL=ventas-listar.service.js.map
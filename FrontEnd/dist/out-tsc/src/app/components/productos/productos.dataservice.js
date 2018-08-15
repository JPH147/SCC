"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var ProductoDataSource = /** @class */ (function () {
    function ProductoDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionProductos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    ProductoDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionProductos.asObservable();
    };
    ProductoDataSource.prototype.disconnect = function () {
        this.InformacionProductos.complete();
        this.CargandoInformacion.complete();
    };
    ProductoDataSource.prototype.CargarProductos = function (tipo, marca, modelo, descripcion, pagina, total_pagina, columna, tipo_orden) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(tipo, marca, modelo, descripcion, pagina, total_pagina, columna, tipo_orden)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            // tslint:disable-next-line:semicolon
            _this.InformacionProductos.next(res['data'].productos);
        });
    };
    return ProductoDataSource;
}());
exports.ProductoDataSource = ProductoDataSource;
//# sourceMappingURL=productos.dataservice.js.map
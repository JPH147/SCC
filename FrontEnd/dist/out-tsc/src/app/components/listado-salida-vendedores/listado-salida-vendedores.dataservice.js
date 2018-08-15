"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var ListadoSalidaVendedoresDataSource = /** @class */ (function () {
    function ListadoSalidaVendedoresDataSource(Servicio) {
        this.Servicio = Servicio;
        this.Datos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    ListadoSalidaVendedoresDataSource.prototype.connect = function (collectionViewer) {
        return this.Datos.asObservable();
    };
    ListadoSalidaVendedoresDataSource.prototype.disconnect = function () {
        this.Datos.complete();
        this.CargandoInformacion.complete();
    };
    ListadoSalidaVendedoresDataSource.prototype.CargarDatos = function (pecosa, sucursal, fecha_inicio, fecha_fin, destino, estado, pagina, total_pagina, orden) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(pecosa, sucursal, fecha_inicio, fecha_fin, destino, estado, pagina, total_pagina, orden)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            _this.Datos.next(res['data'].salidas);
        });
    };
    return ListadoSalidaVendedoresDataSource;
}());
exports.ListadoSalidaVendedoresDataSource = ListadoSalidaVendedoresDataSource;
//# sourceMappingURL=listado-salida-vendedores.dataservice.js.map
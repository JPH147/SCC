"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var ProvinciaDataSource = /** @class */ (function () {
    function ProvinciaDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionProvincias = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    ;
    ProvinciaDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionProvincias.asObservable();
    };
    ProvinciaDataSource.prototype.disconnect = function () {
        this.InformacionProvincias.complete();
        this.CargandoInformacion.complete();
    };
    ProvinciaDataSource.prototype.CargarProvincias = function (departamento, nombre, pagina, total_pagina) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.ListarProvincias(departamento, nombre, pagina, total_pagina)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            _this.InformacionProvincias.next(res['data'].provincias);
        });
    };
    return ProvinciaDataSource;
}());
exports.ProvinciaDataSource = ProvinciaDataSource;
//# sourceMappingURL=provincia.dataservice.js.map
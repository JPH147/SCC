"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var DistritoDataSource = /** @class */ (function () {
    function DistritoDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionDistritos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    ;
    DistritoDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionDistritos.asObservable();
    };
    DistritoDataSource.prototype.disconnect = function () {
        this.InformacionDistritos.complete();
        this.CargandoInformacion.complete();
    };
    DistritoDataSource.prototype.CargarDistritos = function (departamento, provincia, nombre, pagina, total_pagina) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.ListarDistritos(departamento, provincia, nombre, pagina, total_pagina)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            _this.InformacionDistritos.next(res['data'].distritos);
        });
    };
    return DistritoDataSource;
}());
exports.DistritoDataSource = DistritoDataSource;
//# sourceMappingURL=distrito.dataservice.js.map
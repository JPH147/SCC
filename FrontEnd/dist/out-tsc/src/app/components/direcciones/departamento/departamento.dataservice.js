"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var DepartamentoDataSource = /** @class */ (function () {
    function DepartamentoDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionDepartamentos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    ;
    DepartamentoDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionDepartamentos.asObservable();
    };
    DepartamentoDataSource.prototype.disconnect = function () {
        this.InformacionDepartamentos.complete();
        this.CargandoInformacion.complete();
    };
    DepartamentoDataSource.prototype.CargarDepartamentos = function (nombre, pagina, total_pagina) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.ListarDepartamentos(nombre, pagina, total_pagina)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            _this.InformacionDepartamentos.next(res['data'].departamentos);
        });
    };
    return DepartamentoDataSource;
}());
exports.DepartamentoDataSource = DepartamentoDataSource;
//# sourceMappingURL=departamento.dataservice.js.map
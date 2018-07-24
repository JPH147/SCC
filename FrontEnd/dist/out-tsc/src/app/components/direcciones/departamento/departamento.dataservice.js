"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var DepartamentoDataSource = /** @class */ (function () {
    function DepartamentoDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionDirecciones = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
    }
    DepartamentoDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionDirecciones.asObservable();
    };
    DepartamentoDataSource.prototype.disconnect = function () {
        this.InformacionDirecciones.complete();
        this.CargandoInformacion.complete();
    };
    DepartamentoDataSource.prototype.CargarDepartamentos = function (nombre) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.ListarDepartamentos(nombre)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) { return _this.InformacionDirecciones.next(res); });
    };
    return DepartamentoDataSource;
}());
exports.DepartamentoDataSource = DepartamentoDataSource;
//# sourceMappingURL=departamento.dataservice.js.map
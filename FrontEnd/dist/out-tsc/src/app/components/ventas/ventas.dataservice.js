"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var VentaDataSource = /** @class */ (function () {
    function VentaDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionVenta = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
    }
    VentaDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionVenta.asObservable();
    };
    VentaDataSource.prototype.disconnect = function () {
        this.InformacionVenta.complete();
        this.CargandoInformacion.complete();
    };
    VentaDataSource.prototype.GenerarCronograma = function (fechainicio, monto, numerocuotas
    // tslint:disable-next-line:one-line
    ) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(fechainicio, monto, numerocuotas)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) { return _this.InformacionVenta.next(res); });
    };
    return VentaDataSource;
}());
exports.VentaDataSource = VentaDataSource;
//# sourceMappingURL=ventas.dataservice.js.map
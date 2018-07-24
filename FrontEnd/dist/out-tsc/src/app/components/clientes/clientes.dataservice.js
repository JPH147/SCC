"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var ClienteDataSource = /** @class */ (function () {
    function ClienteDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionClientes = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
    }
    ClienteDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionClientes.asObservable();
    };
    ClienteDataSource.prototype.disconnect = function () {
        this.InformacionClientes.complete();
        this.CargandoInformacion.complete();
    };
    ClienteDataSource.prototype.CargarClientes = function (nombreinst, sede, subsede, dni, nombre, apellido
    // tslint:disable-next-line:one-line
    ) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(nombreinst, sede, subsede, dni, nombre, apellido)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) { return _this.InformacionClientes.next(res); });
    };
    return ClienteDataSource;
}());
exports.ClienteDataSource = ClienteDataSource;
//# sourceMappingURL=clientes.dataservice.js.map
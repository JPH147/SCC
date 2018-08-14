"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var rxjs_2 = require("rxjs");
var VentaDataSource = /** @class */ (function () {
    function VentaDataSource(Servicio) {
        this.Servicio = Servicio;
        this.InformacionProductos = new rxjs_1.BehaviorSubject([]);
        this.CargandoInformacion = new rxjs_1.BehaviorSubject(false);
        this.Cargando = this.CargandoInformacion.asObservable();
        this.TotalResultados = new rxjs_1.BehaviorSubject(0);
    }
    VentaDataSource.prototype.connect = function (collectionViewer) {
        return this.InformacionProductos.asObservable();
    };
    VentaDataSource.prototype.disconnect = function () {
        this.InformacionProductos.complete();
        this.CargandoInformacion.complete();
    };
    VentaDataSource.prototype.CargarProductos = function (cliente, tipo_venta, fecha_inicio, fecha_fin, pagina_inicio, pagina_final, orden) {
        var _this = this;
        this.CargandoInformacion.next(true);
        this.Servicio.Listado(cliente, tipo_venta, fecha_inicio, fecha_fin, pagina_inicio, pagina_final, orden)
            .pipe(operators_1.catchError(function () { return rxjs_2.of([]); }), operators_1.finalize(function () { return _this.CargandoInformacion.next(false); }))
            .subscribe(function (res) {
            _this.TotalResultados.next(res['mensaje']);
            _this.InformacionProductos.next(res['data'].ventas);
        });
    };
    return VentaDataSource;
}());
exports.VentaDataSource = VentaDataSource;
//# sourceMappingURL=ventas-listar.dataservice.js.map
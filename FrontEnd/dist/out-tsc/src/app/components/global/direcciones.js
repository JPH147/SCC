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
var url_1 = require("./url");
var operators_1 = require("rxjs/operators");
var ServiciosDirecciones = /** @class */ (function () {
    function ServiciosDirecciones(http) {
        this.http = http;
        this.url = url_1.URL.url;
    }
    /************************************************************************************************/
    /* Departamentos */
    ServiciosDirecciones.prototype.ListarDepartamentos = function (nombre) {
        return this.http.get(this.url + 'direcciondepartamento/read.php', {
            params: new http_1.HttpParams()
                .set('prnombre', nombre)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'].departamentos;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.SeleccionarDepartamento = function (id) {
        return this.http.get(this.url + 'direcciondepartamento/readxId.php', {
            params: new http_1.HttpParams()
                .set('prid', id.toString())
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'];
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.EliminarDepartamento = function (id) {
        var params = new http_1.HttpParams().set('prid', id.toString());
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondepartamento/delete.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.CrearDepartamento = function (nombre) {
        var params = new http_1.HttpParams().set('prnombre', nombre);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondepartamento/create.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.ActualizarDepartamento = function (id, nombre) {
        var params = new http_1.HttpParams()
            .set('prid', id.toString())
            .set('prnombre', nombre);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondepartamento/update.php', params, { headers: headers });
    };
    /************************************************************************************************/
    /* Provincias */
    ServiciosDirecciones.prototype.ListarProvincias = function (departamento, provincia) {
        return this.http.get(this.url + 'direccionprovincia/read.php', {
            params: new http_1.HttpParams()
                .set('prdepartamento', departamento)
                .set('prprovincia', provincia)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'].provincias;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.SeleccionarProvincia = function (id) {
        return this.http.get(this.url + 'direccionprovincia/readxId.php', {
            params: new http_1.HttpParams()
                .set('prid', id.toString())
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'];
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.EliminarProvincia = function (id) {
        var params = new http_1.HttpParams().set('prid', id.toString());
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direccionprovincia/delete.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.CrearProvincia = function (departamento, nombre) {
        var params = new http_1.HttpParams()
            .set('prnombre', nombre)
            .set('prdepartamento', departamento.toString());
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direccionprovincia/create.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.ActualizarProvincia = function (id, departamento, nombre) {
        var params = new http_1.HttpParams()
            .set('prid', id.toString())
            .set('prdepartamento', departamento.toString())
            .set('prnombre', nombre);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direccionprovincia/update.php', params, { headers: headers });
    };
    /************************************************************************************************/
    /* Distritos */
    ServiciosDirecciones.prototype.ListarDistritos = function (departamento, provincia, distrito) {
        return this.http.get(this.url + 'direcciondistrito/read.php', {
            params: new http_1.HttpParams()
                .set('prdepartamento', departamento)
                .set('prprovincia', provincia)
                .set('prdistrito', distrito)
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'].distritos;
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.SeleccionarDistrito = function (id) {
        return this.http.get(this.url + 'direcciondistrito/readxId.php', {
            params: new http_1.HttpParams()
                .set('prid', id.toString())
        })
            .pipe(operators_1.map(function (res) {
            if (res['codigo'] === 0) {
                return res = res['data'];
            }
            else {
                console.log('Error al importar los datos, revisar servicio');
            }
        }));
    };
    ServiciosDirecciones.prototype.EliminarDistrito = function (id) {
        var params = new http_1.HttpParams().set('prid', id.toString());
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondistrito/delete.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.CrearDistrito = function (provincia, nombre) {
        var params = new http_1.HttpParams()
            .set('prnombre', nombre)
            .set('prdepartamento', provincia.toString());
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondistrito/create.php', params, { headers: headers });
    };
    ServiciosDirecciones.prototype.ActualizarDistrito = function (id, provincia, nombre) {
        var params = new http_1.HttpParams()
            .set('prid', id.toString())
            .set('prdepartamento', provincia.toString())
            .set('prnombre', nombre);
        var headers = new http_1.HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.url + 'direcciondistrito/update.php', params, { headers: headers });
    };
    ServiciosDirecciones = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], ServiciosDirecciones);
    return ServiciosDirecciones;
}());
exports.ServiciosDirecciones = ServiciosDirecciones;
//# sourceMappingURL=direcciones.js.map
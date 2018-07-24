"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var listado_salida_vendedores_component_1 = require("./listado-salida-vendedores.component");
describe('ListadoSalidaVendedoresComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [listado_salida_vendedores_component_1.ListadoSalidaVendedoresComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(listado_salida_vendedores_component_1.ListadoSalidaVendedoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=listado-salida-vendedores.component.spec.js.map
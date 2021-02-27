import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaGenerarPagoTransaccionUnitariaComponent } from './ventana-generar-pago-transaccion-unitaria.component';

describe('VentanaGenerarPagoTransaccionUnitariaComponent', () => {
  let component: VentanaGenerarPagoTransaccionUnitariaComponent;
  let fixture: ComponentFixture<VentanaGenerarPagoTransaccionUnitariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaGenerarPagoTransaccionUnitariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaGenerarPagoTransaccionUnitariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaGenerarPagoTransaccionComponent } from './ventana-generar-pago-transaccion.component';

describe('VentanaGenerarPagoTransaccionComponent', () => {
  let component: VentanaGenerarPagoTransaccionComponent;
  let fixture: ComponentFixture<VentanaGenerarPagoTransaccionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaGenerarPagoTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaGenerarPagoTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

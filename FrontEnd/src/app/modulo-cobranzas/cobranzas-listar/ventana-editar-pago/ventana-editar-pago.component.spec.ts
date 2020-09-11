import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEditarPagoComponent } from './ventana-editar-pago.component';

describe('VentanaEditarPagoComponent', () => {
  let component: VentanaEditarPagoComponent;
  let fixture: ComponentFixture<VentanaEditarPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

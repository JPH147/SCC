import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaNotificacionesDetalleComponent } from './ventana-notificaciones-detalle.component';

describe('VentanaNotificacionesDetalleComponent', () => {
  let component: VentanaNotificacionesDetalleComponent;
  let fixture: ComponentFixture<VentanaNotificacionesDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaNotificacionesDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaNotificacionesDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

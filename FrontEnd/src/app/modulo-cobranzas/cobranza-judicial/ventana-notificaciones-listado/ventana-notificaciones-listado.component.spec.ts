import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaNotificacionesListadoComponent } from './ventana-notificaciones-listado.component';

describe('VentanaNotificacionesListadoComponent', () => {
  let component: VentanaNotificacionesListadoComponent;
  let fixture: ComponentFixture<VentanaNotificacionesListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaNotificacionesListadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaNotificacionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaNotificacionesComponent } from './ventana-notificaciones.component';

describe('VentanaNotificacionesComponent', () => {
  let component: VentanaNotificacionesComponent;
  let fixture: ComponentFixture<VentanaNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaNotificacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

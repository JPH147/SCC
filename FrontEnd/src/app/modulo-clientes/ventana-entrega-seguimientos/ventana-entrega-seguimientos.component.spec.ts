import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEntregaSeguimientosComponent } from './ventana-entrega-seguimientos.component';

describe('VentanaEntregaSeguimientosComponent', () => {
  let component: VentanaEntregaSeguimientosComponent;
  let fixture: ComponentFixture<VentanaEntregaSeguimientosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEntregaSeguimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEntregaSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

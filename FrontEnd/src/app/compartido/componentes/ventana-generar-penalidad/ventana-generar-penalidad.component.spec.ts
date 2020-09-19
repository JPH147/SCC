import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaGenerarPenalidadComponent } from './ventana-generar-penalidad.component';

describe('VentanaGenerarPenalidadComponent', () => {
  let component: VentanaGenerarPenalidadComponent;
  let fixture: ComponentFixture<VentanaGenerarPenalidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaGenerarPenalidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaGenerarPenalidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaLiquidacionesComponent } from './ventana-liquidaciones.component';

describe('VentanaLiquidacionesComponent', () => {
  let component: VentanaLiquidacionesComponent;
  let fixture: ComponentFixture<VentanaLiquidacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaLiquidacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaLiquidacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaLiquidacionComponent } from './ventana-liquidacion.component';

describe('VentanaLiquidacionComponent', () => {
  let component: VentanaLiquidacionComponent;
  let fixture: ComponentFixture<VentanaLiquidacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaLiquidacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaLiquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

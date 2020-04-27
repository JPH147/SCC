import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEmergenteIntegralAgregarComponent } from './ventana-emergente-integral-agregar.component';

describe('VentanaEmergenteIntegralAgregarComponent', () => {
  let component: VentanaEmergenteIntegralAgregarComponent;
  let fixture: ComponentFixture<VentanaEmergenteIntegralAgregarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEmergenteIntegralAgregarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEmergenteIntegralAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

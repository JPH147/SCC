import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEmergenteIntegralEditarComponent } from './ventana-emergente-integral-editar.component';

describe('VentanaEmergenteIntegralComponent', () => {
  let component: VentanaEmergenteIntegralEditarComponent;
  let fixture: ComponentFixture<VentanaEmergenteIntegralEditarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEmergenteIntegralEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEmergenteIntegralEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

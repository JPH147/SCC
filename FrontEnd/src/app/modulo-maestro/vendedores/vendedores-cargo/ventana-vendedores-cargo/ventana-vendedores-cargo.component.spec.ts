import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaVendedoresCargoComponent } from './ventana-vendedores-cargo.component';

describe('VentanaVendedoresCargoComponent', () => {
  let component: VentanaVendedoresCargoComponent;
  let fixture: ComponentFixture<VentanaVendedoresCargoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaVendedoresCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaVendedoresCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaPagosComponent } from './ventana-pagos.component';

describe('VentanaPagosComponent', () => {
  let component: VentanaPagosComponent;
  let fixture: ComponentFixture<VentanaPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCobranzaClienteComponent } from './ventana-cobranza-cliente.component';

describe('VentanaCobranzaClienteComponent', () => {
  let component: VentanaCobranzaClienteComponent;
  let fixture: ComponentFixture<VentanaCobranzaClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCobranzaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCobranzaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

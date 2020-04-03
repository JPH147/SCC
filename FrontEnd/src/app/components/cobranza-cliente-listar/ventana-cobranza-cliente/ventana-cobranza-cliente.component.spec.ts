import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCobranzaClienteComponent } from './ventana-cobranza-cliente.component';

describe('VentanaCobranzaClienteComponent', () => {
  let component: VentanaCobranzaClienteComponent;
  let fixture: ComponentFixture<VentanaCobranzaClienteComponent>;

  beforeEach(async(() => {
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

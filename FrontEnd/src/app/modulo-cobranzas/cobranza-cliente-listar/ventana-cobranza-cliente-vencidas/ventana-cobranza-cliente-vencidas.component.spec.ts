import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCobranzaClienteVencidasComponent } from './ventana-cobranza-cliente-vencidas.component';

describe('VentanaCobranzaClienteVencidasComponent', () => {
  let component: VentanaCobranzaClienteVencidasComponent;
  let fixture: ComponentFixture<VentanaCobranzaClienteVencidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCobranzaClienteVencidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCobranzaClienteVencidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

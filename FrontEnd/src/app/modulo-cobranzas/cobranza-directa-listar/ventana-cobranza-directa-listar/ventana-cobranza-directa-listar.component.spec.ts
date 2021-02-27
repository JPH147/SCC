import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCobranzaDirectaListarComponent } from './ventana-cobranza-directa-listar.component';

describe('VentanaCobranzaDirectaListarComponent', () => {
  let component: VentanaCobranzaDirectaListarComponent;
  let fixture: ComponentFixture<VentanaCobranzaDirectaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaCobranzaDirectaListarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCobranzaDirectaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

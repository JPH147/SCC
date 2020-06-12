import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCrearCobranzaManualComponent } from './ventana-crear-cobranza-manual.component';

describe('VentanaCrearCobranzaManualComponent', () => {
  let component: VentanaCrearCobranzaManualComponent;
  let fixture: ComponentFixture<VentanaCrearCobranzaManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCrearCobranzaManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCrearCobranzaManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

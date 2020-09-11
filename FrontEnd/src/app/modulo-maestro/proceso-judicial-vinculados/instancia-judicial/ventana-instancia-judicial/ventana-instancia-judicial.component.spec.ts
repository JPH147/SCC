import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaInstanciaJudicialComponent } from './ventana-instancia-judicial.component';

describe('VentanaInstanciaJudicialComponent', () => {
  let component: VentanaInstanciaJudicialComponent;
  let fixture: ComponentFixture<VentanaInstanciaJudicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaInstanciaJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaInstanciaJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

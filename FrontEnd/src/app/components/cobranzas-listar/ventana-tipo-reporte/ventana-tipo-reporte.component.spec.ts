import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaTipoReporteComponent } from './ventana-tipo-reporte.component';

describe('VentanaTipoReporteComponent', () => {
  let component: VentanaTipoReporteComponent;
  let fixture: ComponentFixture<VentanaTipoReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaTipoReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaTipoReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

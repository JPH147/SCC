import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaArchivosPagoComponent } from './cobranza-archivos-pago.component';

describe('CobranzaArchivosPagoComponent', () => {
  let component: CobranzaArchivosPagoComponent;
  let fixture: ComponentFixture<CobranzaArchivosPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaArchivosPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaArchivosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

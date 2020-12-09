import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaArchivosPagoComponent } from './cobranza-archivos-pago.component';

describe('CobranzaArchivosPagoComponent', () => {
  let component: CobranzaArchivosPagoComponent;
  let fixture: ComponentFixture<CobranzaArchivosPagoComponent>;

  beforeEach(waitForAsync(() => {
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaArchivosDetalleComponent } from './cobranza-archivos-detalle.component';

describe('CobranzaArchivosDetalleComponent', () => {
  let component: CobranzaArchivosDetalleComponent;
  let fixture: ComponentFixture<CobranzaArchivosDetalleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaArchivosDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaArchivosDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

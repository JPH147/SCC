import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDocumentoAlmacenComponent } from './detalle-documento-almacen.component';

describe('DetalleDocumentoAlmacenComponent', () => {
  let component: DetalleDocumentoAlmacenComponent;
  let fixture: ComponentFixture<DetalleDocumentoAlmacenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleDocumentoAlmacenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDocumentoAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

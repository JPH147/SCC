import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEditarDocumentoComponent } from './ventana-editar-documento.component';

describe('VentanaEditarDocumentoComponent', () => {
  let component: VentanaEditarDocumentoComponent;
  let fixture: ComponentFixture<VentanaEditarDocumentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEstadoDocumentosComponent } from './ventana-documentos.component';

describe('VentanaDocumentosComponent', () => {
  let component: VentanaEstadoDocumentosComponent;
  let fixture: ComponentFixture<VentanaEstadoDocumentosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEstadoDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEstadoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

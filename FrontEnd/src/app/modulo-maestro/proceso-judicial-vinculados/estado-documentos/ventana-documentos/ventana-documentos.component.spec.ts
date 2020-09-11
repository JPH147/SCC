import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaEstadoDocumentosComponent } from './ventana-documentos.component';

describe('VentanaDocumentosComponent', () => {
  let component: VentanaEstadoDocumentosComponent;
  let fixture: ComponentFixture<VentanaEstadoDocumentosComponent>;

  beforeEach(async(() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoDocumentosComponent } from './estado-documentos.component';

describe('EstadoDocumentosComponent', () => {
  let component: EstadoDocumentosComponent;
  let fixture: ComponentFixture<EstadoDocumentosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadoDocumentosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

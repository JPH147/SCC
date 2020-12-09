import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstadoDocumentosComponent } from './estado-documentos.component';

describe('EstadoDocumentosComponent', () => {
  let component: EstadoDocumentosComponent;
  let fixture: ComponentFixture<EstadoDocumentosComponent>;

  beforeEach(waitForAsync(() => {
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

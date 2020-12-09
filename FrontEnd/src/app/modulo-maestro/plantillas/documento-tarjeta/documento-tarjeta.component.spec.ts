import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoTarjetaComponent } from './documento-tarjeta.component';

describe('DocumentoTarjetaComponent', () => {
  let component: DocumentoTarjetaComponent;
  let fixture: ComponentFixture<DocumentoTarjetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoTarjetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

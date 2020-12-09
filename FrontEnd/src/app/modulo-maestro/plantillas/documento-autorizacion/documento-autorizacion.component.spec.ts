import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoAutorizacionComponent } from './documento-autorizacion.component';

describe('DocumentoAutorizacionComponent', () => {
  let component: DocumentoAutorizacionComponent;
  let fixture: ComponentFixture<DocumentoAutorizacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoAutorizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoAutorizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoTransaccionComponent } from './documento-transaccion.component';

describe('DocumentoTransaccionComponent', () => {
  let component: DocumentoTransaccionComponent;
  let fixture: ComponentFixture<DocumentoTransaccionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoTransaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

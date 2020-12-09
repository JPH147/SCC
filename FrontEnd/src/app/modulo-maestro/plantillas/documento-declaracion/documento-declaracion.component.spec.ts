import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoDeclaracionComponent } from './documento-declaracion.component';

describe('DocumentoDeclaracionComponent', () => {
  let component: DocumentoDeclaracionComponent;
  let fixture: ComponentFixture<DocumentoDeclaracionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoDeclaracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoDeclaracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

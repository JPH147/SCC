import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentoCompromisoComponent } from './documento-compromiso.component';

describe('DocumentoCompromisoComponent', () => {
  let component: DocumentoCompromisoComponent;
  let fixture: ComponentFixture<DocumentoCompromisoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoCompromisoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoCompromisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

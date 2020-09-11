import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoCartaComponent } from './documento-carta.component';

describe('DocumentoCartaComponent', () => {
  let component: DocumentoCartaComponent;
  let fixture: ComponentFixture<DocumentoCartaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentoCartaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoCartaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

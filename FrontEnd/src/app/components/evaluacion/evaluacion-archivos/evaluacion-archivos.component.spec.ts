import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionArchivosComponent } from './evaluacion-archivos.component';

describe('EvaluacionArchivosComponent', () => {
  let component: EvaluacionArchivosComponent;
  let fixture: ComponentFixture<EvaluacionArchivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionArchivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

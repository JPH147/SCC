import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionOrdenComponent } from './evaluacion-orden.component';

describe('EvaluacionOrdenComponent', () => {
  let component: EvaluacionOrdenComponent;
  let fixture: ComponentFixture<EvaluacionOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

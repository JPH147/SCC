import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluacionOrdenComponent } from './evaluacion-orden.component';

describe('EvaluacionOrdenComponent', () => {
  let component: EvaluacionOrdenComponent;
  let fixture: ComponentFixture<EvaluacionOrdenComponent>;

  beforeEach(waitForAsync(() => {
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

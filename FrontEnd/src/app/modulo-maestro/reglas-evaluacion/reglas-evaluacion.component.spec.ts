import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReglasEvaluacionComponent } from './reglas-evaluacion.component';

describe('ReglasEvaluacionComponent', () => {
  let component: ReglasEvaluacionComponent;
  let fixture: ComponentFixture<ReglasEvaluacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

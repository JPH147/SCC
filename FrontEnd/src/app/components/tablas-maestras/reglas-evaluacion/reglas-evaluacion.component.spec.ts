import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglasEvaluacionComponent } from './reglas-evaluacion.component';

describe('ReglasEvaluacionComponent', () => {
  let component: ReglasEvaluacionComponent;
  let fixture: ComponentFixture<ReglasEvaluacionComponent>;

  beforeEach(async(() => {
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

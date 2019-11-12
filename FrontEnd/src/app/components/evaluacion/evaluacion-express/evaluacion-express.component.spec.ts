import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionExpressComponent } from './evaluacion-express.component';

describe('EvaluacionExpressComponent', () => {
  let component: EvaluacionExpressComponent;
  let fixture: ComponentFixture<EvaluacionExpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionExpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionExpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

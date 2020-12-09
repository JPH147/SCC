import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluacionCuotasComponent } from './evaluacion-cuotas.component';

describe('EvaluacionCuotasComponent', () => {
  let component: EvaluacionCuotasComponent;
  let fixture: ComponentFixture<EvaluacionCuotasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionCuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

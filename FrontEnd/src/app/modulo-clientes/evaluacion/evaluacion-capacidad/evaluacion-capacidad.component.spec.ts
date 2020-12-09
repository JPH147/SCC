import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluacionCapacidadComponent } from './evaluacion-capacidad.component';

describe('EvaluacionCapacidadComponent', () => {
  let component: EvaluacionCapacidadComponent;
  let fixture: ComponentFixture<EvaluacionCapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionCapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionCapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

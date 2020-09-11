import { TestBed, inject } from '@angular/core/testing';

import { ReglasEvaluacionService } from './reglas-evaluacion.service';

describe('ReglasEvaluacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReglasEvaluacionService]
    });
  });

  it('should be created', inject([ReglasEvaluacionService], (service: ReglasEvaluacionService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { EvaluacionService } from './evaluacion.service';

describe('EvaluacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluacionService]
    });
  });

  it('should be created', inject([EvaluacionService], (service: EvaluacionService) => {
    expect(service).toBeTruthy();
  }));
});

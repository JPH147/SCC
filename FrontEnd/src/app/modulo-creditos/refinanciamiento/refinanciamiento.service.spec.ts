import { TestBed } from '@angular/core/testing';

import { RefinanciamientoService } from './refinanciamiento.service';

describe('RefinanciamientoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RefinanciamientoService = TestBed.get(RefinanciamientoService);
    expect(service).toBeTruthy();
  });
});

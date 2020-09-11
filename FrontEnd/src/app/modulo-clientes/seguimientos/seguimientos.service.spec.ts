import { TestBed } from '@angular/core/testing';

import { SeguimientosService } from './seguimientos.service';

describe('SeguimientosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SeguimientosService = TestBed.get(SeguimientosService);
    expect(service).toBeTruthy();
  });
});

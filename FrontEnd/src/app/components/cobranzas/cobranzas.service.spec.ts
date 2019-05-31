import { TestBed } from '@angular/core/testing';

import { CobranzasService } from './cobranzas.service';

describe('CobranzasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobranzasService = TestBed.get(CobranzasService);
    expect(service).toBeTruthy();
  });
});

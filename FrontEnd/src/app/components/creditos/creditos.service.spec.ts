import { TestBed } from '@angular/core/testing';

import { CreditosService } from './creditos.service';

describe('CreditosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreditosService = TestBed.get(CreditosService);
    expect(service).toBeTruthy();
  });
});

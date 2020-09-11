import { TestBed } from '@angular/core/testing';

import { CobranzaJudicialService } from './cobranza-judicial.service';

describe('CobranzaJudicialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CobranzaJudicialService = TestBed.get(CobranzaJudicialService);
    expect(service).toBeTruthy();
  });
});

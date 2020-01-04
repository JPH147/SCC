import { TestBed } from '@angular/core/testing';

import { ProcesoJudicialVinculadosService } from './proceso-judicial-vinculados.service';

describe('ProcesoJudicialVinculadosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcesoJudicialVinculadosService = TestBed.get(ProcesoJudicialVinculadosService);
    expect(service).toBeTruthy();
  });
});

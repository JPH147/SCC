import { TestBed } from '@angular/core/testing';

import { CooperativaConfiguracionService } from './cooperativa-configuracion.service';

describe('CooperativaConfiguracionService', () => {
  let service: CooperativaConfiguracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CooperativaConfiguracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

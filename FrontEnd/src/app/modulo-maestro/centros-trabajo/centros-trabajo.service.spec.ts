import { TestBed } from '@angular/core/testing';

import { CentrosTrabajoService } from './centros-trabajo.service';

describe('CentrosTrabajoService', () => {
  let service: CentrosTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentrosTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

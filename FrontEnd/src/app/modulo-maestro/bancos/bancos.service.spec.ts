import { TestBed } from '@angular/core/testing';

import { BancosService } from './bancos.service';

describe('BancosService', () => {
  let service: BancosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BancosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

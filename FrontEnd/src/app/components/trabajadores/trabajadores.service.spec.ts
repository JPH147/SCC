import { TestBed } from '@angular/core/testing';

import { TrabajadoresService } from './trabajadores.service';

describe('TrabajadoresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrabajadoresService = TestBed.get(TrabajadoresService);
    expect(service).toBeTruthy();
  });
});

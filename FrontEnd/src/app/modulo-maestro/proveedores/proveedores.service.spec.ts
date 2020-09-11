import { TestBed, inject } from '@angular/core/testing';

import { ProveedorService } from './proveedores.service';

describe('ProveedorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProveedorService]
    });
  });

  it('should be created', inject([ProveedorService], (service: ProveedorService) => {
    expect(service).toBeTruthy();
  }));
});

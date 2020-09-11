import { TestBed, inject } from '@angular/core/testing';

import { SalidaProductosService } from './salida-productos.service';

describe('SalidaProductosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalidaProductosService]
    });
  });

  it('should be created', inject([SalidaProductosService], (service: SalidaProductosService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { HistorialSerie.DataService } from './historial-serie.data.service';

describe('HistorialSerie.DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistorialSerie.DataService]
    });
  });

  it('should be created', inject([HistorialSerie.DataService], (service: HistorialSerie.DataService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { PlantillasService } from './plantillas.service';

describe('PlantillasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlantillasService = TestBed.get(PlantillasService);
    expect(service).toBeTruthy();
  });
});

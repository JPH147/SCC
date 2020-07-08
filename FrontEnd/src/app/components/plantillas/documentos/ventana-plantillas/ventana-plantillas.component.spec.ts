import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaPlantillasComponent } from './ventana-plantillas.component';

describe('VentanaPlantillasComponent', () => {
  let component: VentanaPlantillasComponent;
  let fixture: ComponentFixture<VentanaPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

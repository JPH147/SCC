import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaPlantillasComponent } from './ventana-plantillas.component';

describe('VentanaPlantillasComponent', () => {
  let component: VentanaPlantillasComponent;
  let fixture: ComponentFixture<VentanaPlantillasComponent>;

  beforeEach(waitForAsync(() => {
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

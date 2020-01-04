import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaParametrosPlantillasComponent } from './ventana-parametros-plantillas.component';

describe('VentanaParametrosPlantillasComponent', () => {
  let component: VentanaParametrosPlantillasComponent;
  let fixture: ComponentFixture<VentanaParametrosPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaParametrosPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaParametrosPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

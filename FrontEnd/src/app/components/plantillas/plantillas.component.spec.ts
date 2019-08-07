import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillasComponent } from './plantillas.component';

describe('PlantillasComponent', () => {
  let component: PlantillasComponent;
  let fixture: ComponentFixture<PlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

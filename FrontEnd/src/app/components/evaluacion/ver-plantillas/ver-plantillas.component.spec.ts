import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPlantillasComponent } from './ver-plantillas.component';

describe('VerPlantillasComponent', () => {
  let component: VerPlantillasComponent;
  let fixture: ComponentFixture<VerPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

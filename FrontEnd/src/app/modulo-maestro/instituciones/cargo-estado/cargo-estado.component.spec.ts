import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoEstadoComponent } from './cargo-estado.component';

describe('CargoEstadoComponent', () => {
  let component: CargoEstadoComponent;
  let fixture: ComponentFixture<CargoEstadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

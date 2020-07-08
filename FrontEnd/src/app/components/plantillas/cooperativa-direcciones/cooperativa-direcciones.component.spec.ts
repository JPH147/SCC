import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CooperativaDireccionesComponent } from './cooperativa-direcciones.component';

describe('CooperativaDireccionesComponent', () => {
  let component: CooperativaDireccionesComponent;
  let fixture: ComponentFixture<CooperativaDireccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CooperativaDireccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CooperativaDireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

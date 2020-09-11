import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaInstitucionComponent } from './ventana-institucion.component';

describe('VentanaInstitucionComponent', () => {
  let component: VentanaInstitucionComponent;
  let fixture: ComponentFixture<VentanaInstitucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaInstitucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaInstitucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

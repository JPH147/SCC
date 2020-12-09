import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaInstitucionComponent } from './ventana-institucion.component';

describe('VentanaInstitucionComponent', () => {
  let component: VentanaInstitucionComponent;
  let fixture: ComponentFixture<VentanaInstitucionComponent>;

  beforeEach(waitForAsync(() => {
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

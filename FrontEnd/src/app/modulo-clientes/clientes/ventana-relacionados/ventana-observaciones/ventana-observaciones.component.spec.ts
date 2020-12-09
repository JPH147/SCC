import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaObservacionesComponent } from './ventana-observaciones.component';

describe('VentanaObservacionesComponent', () => {
  let component: VentanaObservacionesComponent;
  let fixture: ComponentFixture<VentanaObservacionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

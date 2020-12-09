import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCargoEstadoComponent } from './ventana-cargo-estado.component';

describe('VentanaCargoEstadoComponent', () => {
  let component: VentanaCargoEstadoComponent;
  let fixture: ComponentFixture<VentanaCargoEstadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCargoEstadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCargoEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaSeguimientosComponent } from './ventana-seguimientos.component';

describe('VentanaSeguimientosComponent', () => {
  let component: VentanaSeguimientosComponent;
  let fixture: ComponentFixture<VentanaSeguimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaSeguimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaSeguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

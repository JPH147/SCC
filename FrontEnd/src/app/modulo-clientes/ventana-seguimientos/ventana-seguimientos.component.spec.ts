import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaSeguimientosComponent } from './ventana-seguimientos.component';

describe('VentanaSeguimientosComponent', () => {
  let component: VentanaSeguimientosComponent;
  let fixture: ComponentFixture<VentanaSeguimientosComponent>;

  beforeEach(waitForAsync(() => {
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

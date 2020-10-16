import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCooperativaCuentaComponent } from './ventana-cooperativa-cuenta.component';

describe('VentanaCooperativaCuentaComponent', () => {
  let component: VentanaCooperativaCuentaComponent;
  let fixture: ComponentFixture<VentanaCooperativaCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaCooperativaCuentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCooperativaCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

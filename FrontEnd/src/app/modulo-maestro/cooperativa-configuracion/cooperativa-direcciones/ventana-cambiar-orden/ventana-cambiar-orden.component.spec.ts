import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCambiarOrdenComponent } from './ventana-cambiar-orden.component';

describe('VentanaCambiarOrdenComponent', () => {
  let component: VentanaCambiarOrdenComponent;
  let fixture: ComponentFixture<VentanaCambiarOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaCambiarOrdenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCambiarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

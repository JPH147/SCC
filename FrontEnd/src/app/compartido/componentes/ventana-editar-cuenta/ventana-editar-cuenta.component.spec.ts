import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEditarCuentaComponent } from './ventana-editar-cuenta.component';

describe('VentanaEditarCuentaComponent', () => {
  let component: VentanaEditarCuentaComponent;
  let fixture: ComponentFixture<VentanaEditarCuentaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarCuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

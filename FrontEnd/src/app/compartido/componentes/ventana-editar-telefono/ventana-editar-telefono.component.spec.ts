import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaEditarTelefonoComponent } from './ventana-editar-telefono.component';

describe('VentanaEditarTelefonoComponent', () => {
  let component: VentanaEditarTelefonoComponent;
  let fixture: ComponentFixture<VentanaEditarTelefonoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaEditarTelefonoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaEditarTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

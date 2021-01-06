import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCentroTrabajoPnpComponent } from './ventana-centro-trabajo-pnp.component';

describe('VentanaCentroTrabajoPnpComponent', () => {
  let component: VentanaCentroTrabajoPnpComponent;
  let fixture: ComponentFixture<VentanaCentroTrabajoPnpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaCentroTrabajoPnpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCentroTrabajoPnpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

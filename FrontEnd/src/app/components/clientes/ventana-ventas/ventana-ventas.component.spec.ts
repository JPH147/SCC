import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaVentasComponent } from './ventana-ventas.component';

describe('VentanaVentasComponent', () => {
  let component: VentanaVentasComponent;
  let fixture: ComponentFixture<VentanaVentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaVentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

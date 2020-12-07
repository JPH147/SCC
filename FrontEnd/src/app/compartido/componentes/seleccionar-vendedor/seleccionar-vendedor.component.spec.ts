import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarVendedorComponent } from './seleccionar-vendedor.component';

describe('SeleccionarVendedorComponent', () => {
  let component: SeleccionarVendedorComponent;
  let fixture: ComponentFixture<SeleccionarVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionarVendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

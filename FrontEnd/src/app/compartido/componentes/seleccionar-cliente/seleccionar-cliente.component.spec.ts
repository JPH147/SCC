import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeleccionarClienteComponent } from './seleccionar-cliente.component';

describe('SeleccionarClienteComponent', () => {
  let component: SeleccionarClienteComponent;
  let fixture: ComponentFixture<SeleccionarClienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeleccionarClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeleccionarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProveedoresMovimientosComponent } from './proveedores-movimientos.component';

describe('ProveedoresMovimientosComponent', () => {
  let component: ProveedoresMovimientosComponent;
  let fixture: ComponentFixture<ProveedoresMovimientosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedoresMovimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedoresMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

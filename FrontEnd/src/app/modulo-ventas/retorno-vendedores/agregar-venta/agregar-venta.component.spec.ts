import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVentaComponent } from './agregar-venta.component';

describe('AgregarVentaComponent', () => {
  let component: AgregarVentaComponent;
  let fixture: ComponentFixture<AgregarVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

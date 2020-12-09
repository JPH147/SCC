import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IngresoProductosComponent } from './ingreso-productos.component';

describe('IngresoProductosComponent', () => {
  let component: IngresoProductosComponent;
  let fixture: ComponentFixture<IngresoProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

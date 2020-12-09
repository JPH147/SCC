import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaProductosComponent } from './ventana-productos.component';

describe('VentanaProductosComponent', () => {
  let component: VentanaProductosComponent;
  let fixture: ComponentFixture<VentanaProductosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

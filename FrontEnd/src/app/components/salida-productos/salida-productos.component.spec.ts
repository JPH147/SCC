import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaProductosComponent } from './salida-productos.component';

describe('SalidaProductosComponent', () => {
  let component: SalidaProductosComponent;
  let fixture: ComponentFixture<SalidaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalidaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

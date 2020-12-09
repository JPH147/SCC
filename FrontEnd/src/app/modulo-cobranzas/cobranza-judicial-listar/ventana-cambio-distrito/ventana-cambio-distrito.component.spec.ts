import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCambioDistritoComponent } from './ventana-cambio-distrito.component';

describe('VentanaCambioDistritoComponent', () => {
  let component: VentanaCambioDistritoComponent;
  let fixture: ComponentFixture<VentanaCambioDistritoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCambioDistritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCambioDistritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

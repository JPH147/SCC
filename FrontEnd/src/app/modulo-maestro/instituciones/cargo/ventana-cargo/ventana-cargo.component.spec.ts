import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaCargoComponent } from './ventana-cargo.component';

describe('VentanaCargoComponent', () => {
  let component: VentanaCargoComponent;
  let fixture: ComponentFixture<VentanaCargoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

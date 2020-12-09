import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaSubsedeComponent } from './ventana-subsede.component';

describe('VentanaSubsedeComponent', () => {
  let component: VentanaSubsedeComponent;
  let fixture: ComponentFixture<VentanaSubsedeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaSubsedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaSubsedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

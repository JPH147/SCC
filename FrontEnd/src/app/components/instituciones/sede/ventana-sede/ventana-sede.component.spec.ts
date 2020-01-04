import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaSedeComponent } from './ventana-sede.component';

describe('VentanaSedeComponent', () => {
  let component: VentanaSedeComponent;
  let fixture: ComponentFixture<VentanaSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

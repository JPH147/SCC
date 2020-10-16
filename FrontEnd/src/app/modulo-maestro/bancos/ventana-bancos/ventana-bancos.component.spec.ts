import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaBancosComponent } from './ventana-bancos.component';

describe('VentanaBancosComponent', () => {
  let component: VentanaBancosComponent;
  let fixture: ComponentFixture<VentanaBancosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VentanaBancosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaBancosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

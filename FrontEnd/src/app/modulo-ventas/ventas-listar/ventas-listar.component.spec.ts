import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentasListarComponent } from './ventas-listar.component';

describe('VentasListarComponent', () => {
  let component: VentasListarComponent;
  let fixture: ComponentFixture<VentasListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

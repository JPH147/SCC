import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaCourierComponent } from './ventana-courier.component';

describe('VentanaCourierComponent', () => {
  let component: VentanaCourierComponent;
  let fixture: ComponentFixture<VentanaCourierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaCourierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

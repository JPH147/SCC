import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaJudicialComponent } from './ventana-judicial.component';

describe('VentanaJudicialComponent', () => {
  let component: VentanaJudicialComponent;
  let fixture: ComponentFixture<VentanaJudicialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

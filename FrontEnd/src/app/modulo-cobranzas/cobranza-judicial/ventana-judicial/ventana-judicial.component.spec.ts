import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaJudicialComponent } from './ventana-judicial.component';

describe('VentanaJudicialComponent', () => {
  let component: VentanaJudicialComponent;
  let fixture: ComponentFixture<VentanaJudicialComponent>;

  beforeEach(async(() => {
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

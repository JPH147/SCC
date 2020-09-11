import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanaDistritoJudicialComponent } from './ventana-distrito-judicial.component';

describe('VentanaDistritoJudicialComponent', () => {
  let component: VentanaDistritoJudicialComponent;
  let fixture: ComponentFixture<VentanaDistritoJudicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaDistritoJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaDistritoJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

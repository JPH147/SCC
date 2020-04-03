import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaJudicialMultipleComponent } from './cobranza-judicial-multiple.component';

describe('CobranzaJudicialMultipleComponent', () => {
  let component: CobranzaJudicialMultipleComponent;
  let fixture: ComponentFixture<CobranzaJudicialMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

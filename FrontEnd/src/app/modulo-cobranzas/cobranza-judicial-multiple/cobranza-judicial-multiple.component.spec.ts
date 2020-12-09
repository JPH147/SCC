import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaJudicialMultipleComponent } from './cobranza-judicial-multiple.component';

describe('CobranzaJudicialMultipleComponent', () => {
  let component: CobranzaJudicialMultipleComponent;
  let fixture: ComponentFixture<CobranzaJudicialMultipleComponent>;

  beforeEach(waitForAsync(() => {
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

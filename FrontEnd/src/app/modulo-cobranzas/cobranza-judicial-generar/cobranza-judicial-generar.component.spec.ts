import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaJudicialGenerarComponent } from './cobranza-judicial-generar.component';

describe('CobranzaJudicialGenerarComponent', () => {
  let component: CobranzaJudicialGenerarComponent;
  let fixture: ComponentFixture<CobranzaJudicialGenerarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialGenerarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialGenerarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaJudicialDistritosComponent } from './cobranza-judicial-distritos.component';

describe('CobranzaJudicialDistritosComponent', () => {
  let component: CobranzaJudicialDistritosComponent;
  let fixture: ComponentFixture<CobranzaJudicialDistritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialDistritosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialDistritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

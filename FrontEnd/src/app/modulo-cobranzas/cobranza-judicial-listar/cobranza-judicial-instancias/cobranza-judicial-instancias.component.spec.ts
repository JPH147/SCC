import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaJudicialInstanciasComponent } from './cobranza-judicial-instancias.component';

describe('CobranzaJudicialInstanciasComponent', () => {
  let component: CobranzaJudicialInstanciasComponent;
  let fixture: ComponentFixture<CobranzaJudicialInstanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialInstanciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialInstanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

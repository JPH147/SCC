import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaJudicialListarComponent } from './cobranza-judicial-listar.component';

describe('CobranzaJudicialListarComponent', () => {
  let component: CobranzaJudicialListarComponent;
  let fixture: ComponentFixture<CobranzaJudicialListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaJudicialListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaJudicialListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

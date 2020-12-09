import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaJudicialListarComponent } from './cobranza-judicial-listar.component';

describe('CobranzaJudicialListarComponent', () => {
  let component: CobranzaJudicialListarComponent;
  let fixture: ComponentFixture<CobranzaJudicialListarComponent>;

  beforeEach(waitForAsync(() => {
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

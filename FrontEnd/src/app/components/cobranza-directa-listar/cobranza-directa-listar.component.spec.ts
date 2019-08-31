import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaDirectaListarComponent } from './cobranza-directa-listar.component';

describe('CobranzaDirectaListarComponent', () => {
  let component: CobranzaDirectaListarComponent;
  let fixture: ComponentFixture<CobranzaDirectaListarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaDirectaListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaDirectaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaDirectaComponent } from './cobranza-directa.component';

describe('CobranzaDirectaComponent', () => {
  let component: CobranzaDirectaComponent;
  let fixture: ComponentFixture<CobranzaDirectaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaDirectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaDirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

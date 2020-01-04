import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanciaJudicialComponent } from './instancia-judicial.component';

describe('InstanciaJudicialComponent', () => {
  let component: InstanciaJudicialComponent;
  let fixture: ComponentFixture<InstanciaJudicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanciaJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanciaJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

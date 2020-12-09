import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InstanciaJudicialComponent } from './instancia-judicial.component';

describe('InstanciaJudicialComponent', () => {
  let component: InstanciaJudicialComponent;
  let fixture: ComponentFixture<InstanciaJudicialComponent>;

  beforeEach(waitForAsync(() => {
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

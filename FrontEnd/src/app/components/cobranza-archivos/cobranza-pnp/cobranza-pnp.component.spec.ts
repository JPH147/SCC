import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaPnpComponent } from './cobranza-pnp.component';

describe('CobranzaPnpComponent', () => {
  let component: CobranzaPnpComponent;
  let fixture: ComponentFixture<CobranzaPnpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaPnpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaPnpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

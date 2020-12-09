import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaPnpComponent } from './cobranza-pnp.component';

describe('CobranzaPnpComponent', () => {
  let component: CobranzaPnpComponent;
  let fixture: ComponentFixture<CobranzaPnpComponent>;

  beforeEach(waitForAsync(() => {
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedoresCargoComponent } from './vendedores-cargo.component';

describe('VendedoresCargoComponent', () => {
  let component: VendedoresCargoComponent;
  let fixture: ComponentFixture<VendedoresCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendedoresCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedoresCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

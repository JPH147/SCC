import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsedeComponent } from './subsede.component';

describe('SubsedeComponent', () => {
  let component: SubsedeComponent;
  let fixture: ComponentFixture<SubsedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

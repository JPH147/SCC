import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubsedeComponent } from './subsede.component';

describe('SubsedeComponent', () => {
  let component: SubsedeComponent;
  let fixture: ComponentFixture<SubsedeComponent>;

  beforeEach(waitForAsync(() => {
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

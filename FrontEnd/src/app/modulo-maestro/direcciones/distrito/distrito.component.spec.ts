import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistritoComponent } from './distrito.component';

describe('DistritoComponent', () => {
  let component: DistritoComponent;
  let fixture: ComponentFixture<DistritoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DistritoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

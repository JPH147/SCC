import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DistritoJudicialComponent } from './distrito-judicial.component';

describe('DistritoJudicialComponent', () => {
  let component: DistritoJudicialComponent;
  let fixture: ComponentFixture<DistritoJudicialComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DistritoJudicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistritoJudicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProvinciaComponent } from './provincia.component';

describe('ProvinciaComponent', () => {
  let component: ProvinciaComponent;
  let fixture: ComponentFixture<ProvinciaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

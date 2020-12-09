import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AfiliacionesComponent } from './afiliaciones.component';

describe('AfiliacionesComponent', () => {
  let component: AfiliacionesComponent;
  let fixture: ComponentFixture<AfiliacionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AfiliacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfiliacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

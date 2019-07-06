import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalonariosComponent } from './talonarios.component';

describe('TalonariosComponent', () => {
  let component: TalonariosComponent;
  let fixture: ComponentFixture<TalonariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalonariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalonariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

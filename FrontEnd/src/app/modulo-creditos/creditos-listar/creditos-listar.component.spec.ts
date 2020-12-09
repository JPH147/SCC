import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditosListarComponent } from './creditos-listar.component';

describe('CreditosListarComponent', () => {
  let component: CreditosListarComponent;
  let fixture: ComponentFixture<CreditosListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzasListarComponent } from './cobranzas-listar.component';

describe('CobranzasListarComponent', () => {
  let component: CobranzasListarComponent;
  let fixture: ComponentFixture<CobranzasListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzasListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzasListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

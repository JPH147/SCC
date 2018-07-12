import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarproductoComponent } from './agregarproducto.component';

describe('AgregarproductoComponent', () => {
  let component: AgregarproductoComponent;
  let fixture: ComponentFixture<AgregarproductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarproductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

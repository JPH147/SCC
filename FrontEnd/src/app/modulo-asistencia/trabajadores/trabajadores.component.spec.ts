import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadoresComponent } from './trabajadores.component';

describe('TrabajadoresComponent', () => {
  let component: TrabajadoresComponent;
  let fixture: ComponentFixture<TrabajadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrabajadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

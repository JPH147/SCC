import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PermisosListarComponent } from './permisos-listar.component';

describe('PermisosListarComponent', () => {
  let component: PermisosListarComponent;
  let fixture: ComponentFixture<PermisosListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PermisosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermisosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

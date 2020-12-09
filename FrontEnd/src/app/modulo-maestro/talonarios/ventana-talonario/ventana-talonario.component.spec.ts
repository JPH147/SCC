import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VentanaTalonarioComponent } from './ventana-talonario.component';

describe('VentanaTalonarioComponent', () => {
  let component: VentanaTalonarioComponent;
  let fixture: ComponentFixture<VentanaTalonarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanaTalonarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanaTalonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

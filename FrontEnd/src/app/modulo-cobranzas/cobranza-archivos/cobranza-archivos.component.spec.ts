import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaArchivosComponent } from './cobranza-archivos.component';

describe('CobranzaArchivosComponent', () => {
  let component: CobranzaArchivosComponent;
  let fixture: ComponentFixture<CobranzaArchivosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaArchivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaArchivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

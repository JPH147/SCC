import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CobranzaArchivosListarComponent } from './cobranza-archivos-listar.component';

describe('CobranzaArchivosListarComponent', () => {
  let component: CobranzaArchivosListarComponent;
  let fixture: ComponentFixture<CobranzaArchivosListarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CobranzaArchivosListarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobranzaArchivosListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

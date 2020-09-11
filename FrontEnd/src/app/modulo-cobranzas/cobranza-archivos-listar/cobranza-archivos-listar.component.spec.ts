import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobranzaArchivosListarComponent } from './cobranza-archivos-listar.component';

describe('CobranzaArchivosListarComponent', () => {
  let component: CobranzaArchivosListarComponent;
  let fixture: ComponentFixture<CobranzaArchivosListarComponent>;

  beforeEach(async(() => {
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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaZakazivanjaComponent } from './lista-zakazivanja.component';

describe('ListaZakazivanjaComponent', () => {
  let component: ListaZakazivanjaComponent;
  let fixture: ComponentFixture<ListaZakazivanjaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaZakazivanjaComponent]
    });
    fixture = TestBed.createComponent(ListaZakazivanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

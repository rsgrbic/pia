import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoratorZakazivanjaComponent } from './dekorator-zakazivanja.component';

describe('DekoratorZakazivanjaComponent', () => {
  let component: DekoratorZakazivanjaComponent;
  let fixture: ComponentFixture<DekoratorZakazivanjaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoratorZakazivanjaComponent]
    });
    fixture = TestBed.createComponent(DekoratorZakazivanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

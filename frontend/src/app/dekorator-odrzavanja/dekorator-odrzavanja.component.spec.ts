import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoratorOdrzavanjaComponent } from './dekorator-odrzavanja.component';

describe('DekoratorOdrzavanjaComponent', () => {
  let component: DekoratorOdrzavanjaComponent;
  let fixture: ComponentFixture<DekoratorOdrzavanjaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoratorOdrzavanjaComponent]
    });
    fixture = TestBed.createComponent(DekoratorOdrzavanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

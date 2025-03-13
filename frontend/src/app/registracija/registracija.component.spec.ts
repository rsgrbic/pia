import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaComponent } from './registracija.component';

describe('RegistracijaComponent', () => {
  let component: RegistracijaComponent;
  let fixture: ComponentFixture<RegistracijaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistracijaComponent]
    });
    fixture = TestBed.createComponent(RegistracijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

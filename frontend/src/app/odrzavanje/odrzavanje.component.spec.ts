import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdrzavanjeComponent } from './odrzavanje.component';

describe('OdrzavanjeComponent', () => {
  let component: OdrzavanjeComponent;
  let fixture: ComponentFixture<OdrzavanjeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OdrzavanjeComponent]
    });
    fixture = TestBed.createComponent(OdrzavanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

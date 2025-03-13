import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SveFirmeComponent } from './sve-firme.component';

describe('SveFirmeComponent', () => {
  let component: SveFirmeComponent;
  let fixture: ComponentFixture<SveFirmeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SveFirmeComponent]
    });
    fixture = TestBed.createComponent(SveFirmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

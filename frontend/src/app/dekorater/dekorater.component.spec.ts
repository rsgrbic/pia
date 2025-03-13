import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoraterComponent } from './dekorater.component';

describe('DekoraterComponent', () => {
  let component: DekoraterComponent;
  let fixture: ComponentFixture<DekoraterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoraterComponent]
    });
    fixture = TestBed.createComponent(DekoraterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

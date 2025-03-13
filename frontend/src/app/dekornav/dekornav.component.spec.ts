import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekornavComponent } from './dekornav.component';

describe('DekornavComponent', () => {
  let component: DekornavComponent;
  let fixture: ComponentFixture<DekornavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekornavComponent]
    });
    fixture = TestBed.createComponent(DekornavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

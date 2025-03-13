import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DekoratorStatistikaComponent } from './dekorator-statistika.component';

describe('DekoratorStatistikaComponent', () => {
  let component: DekoratorStatistikaComponent;
  let fixture: ComponentFixture<DekoratorStatistikaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DekoratorStatistikaComponent]
    });
    fixture = TestBed.createComponent(DekoratorStatistikaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFirmaComponent } from './admin-firma.component';

describe('AdminFirmaComponent', () => {
  let component: AdminFirmaComponent;
  let fixture: ComponentFixture<AdminFirmaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminFirmaComponent]
    });
    fixture = TestBed.createComponent(AdminFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

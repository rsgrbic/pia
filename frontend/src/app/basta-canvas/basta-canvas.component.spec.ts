import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BastaCanvasComponent } from './basta-canvas.component';

describe('BastaCanvasComponent', () => {
  let component: BastaCanvasComponent;
  let fixture: ComponentFixture<BastaCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BastaCanvasComponent]
    });
    fixture = TestBed.createComponent(BastaCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

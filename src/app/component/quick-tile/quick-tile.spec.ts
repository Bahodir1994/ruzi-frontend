import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTile } from './quick-tile';

describe('QuickTile', () => {
  let component: QuickTile;
  let fixture: ComponentFixture<QuickTile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickTile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickTile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

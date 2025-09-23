import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FontsizeComponent} from './fontsize.component';

describe('FontsizeComponent', () => {
  let component: FontsizeComponent;
  let fixture: ComponentFixture<FontsizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontsizeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FontsizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageLibrary} from './image.library';

describe('ImageLibrary', () => {
  let component: ImageLibrary;
  let fixture: ComponentFixture<ImageLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLibrary]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ImageLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

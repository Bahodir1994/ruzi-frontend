import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDirectory } from './main-directory';

describe('MainDirectory', () => {
  let component: MainDirectory;
  let fixture: ComponentFixture<MainDirectory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDirectory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainDirectory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

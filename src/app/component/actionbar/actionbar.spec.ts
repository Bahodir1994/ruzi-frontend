import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Actionbar} from './actionbar';

describe('Actionbar', () => {
  let component: Actionbar;
  let fixture: ComponentFixture<Actionbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actionbar]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Actionbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

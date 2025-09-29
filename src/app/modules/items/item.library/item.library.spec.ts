import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemLibrary} from './item.library';

describe('ItemLibrary', () => {
  let component: ItemLibrary;
  let fixture: ComponentFixture<ItemLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemLibrary]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

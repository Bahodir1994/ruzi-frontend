import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cashbox } from './cashbox';

describe('Cashbox', () => {
  let component: Cashbox;
  let fixture: ComponentFixture<Cashbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cashbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cashbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

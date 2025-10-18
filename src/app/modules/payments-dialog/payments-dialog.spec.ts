import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsDialog } from './payments-dialog';

describe('PaymentsDialog', () => {
  let component: PaymentsDialog;
  let fixture: ComponentFixture<PaymentsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

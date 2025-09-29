import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignAndSecurity} from './sign-and-security';

describe('SignAndSecurity', () => {
  let component: SignAndSecurity;
  let fixture: ComponentFixture<SignAndSecurity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignAndSecurity]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignAndSecurity);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

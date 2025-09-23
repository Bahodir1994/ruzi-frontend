import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpPageComponent} from './http-page.component';

describe('HttpPageComponent', () => {
  let component: HttpPageComponent;
  let fixture: ComponentFixture<HttpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HttpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

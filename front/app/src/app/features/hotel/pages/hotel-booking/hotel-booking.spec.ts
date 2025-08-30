import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelBooking } from './hotel-booking';

describe('HotelBooking', () => {
  let component: HotelBooking;
  let fixture: ComponentFixture<HotelBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelBooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelBooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

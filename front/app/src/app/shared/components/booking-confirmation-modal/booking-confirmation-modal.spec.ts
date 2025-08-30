import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationModal } from './booking-confirmation-modal';

describe('BookingConfirmationModal', () => {
  let component: BookingConfirmationModal;
  let fixture: ComponentFixture<BookingConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingConfirmationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

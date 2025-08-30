import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservationService } from '../../features/hotel/services/reservation-service';
import { CreateBookingRequest, Booking } from '../../shared/models/booking-model';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-booking.html',
  styleUrl: './create-booking.scss'
})
export class CreateBookingComponent {
  private readonly reservationService = inject(ReservationService);

  booking: CreateBookingRequest = {
    userId: '',
    hotelId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    totalPrice: 0,
    contactEmail: '',
    contactPhone: ''
  };

  isLoading = signal(false);
  message = signal<string | null>(null);
  error = signal<string | null>(null);
  created = signal<Booking | null>(null);

  submit(): void {
    this.isLoading.set(true);
    this.message.set(null);
    this.error.set(null);

    this.reservationService.createReservation(this.booking).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.created.set(res);
        this.message.set('Reserva creada exitosamente.');
      },
      error: (err: Error) => {
        this.isLoading.set(false);
        this.error.set(err.message || 'No se pudo crear la reserva.');
      }
    });
  }
}

import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ReservationService } from '../../features/hotel/services/reservation-service';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancel-booking.html',
  styleUrl: './cancel-booking.scss'
})
export class CancelBookingComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly reservationService = inject(ReservationService);
  private readonly destroyRef = inject(DestroyRef);

  bookingId = signal('');
  message = signal<string | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('bookingId');
    if (id) {
      this.bookingId.set(id);
    }
  }

  cancelBooking(): void {
    const id = this.bookingId();
    if (!id) {
      this.error.set('ID de reserva no válido');
      return;
    }

    this.isLoading.set(true);
    this.message.set(null);
    this.error.set(null);

    this.reservationService.cancelReservation(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.message.set('Reserva cancelada exitosamente.');
        },
        error: (err: Error) => {
          this.isLoading.set(false);
          this.error.set(err.message || 'No se pudo cancelar la reserva.');
        }
      });
  }
}


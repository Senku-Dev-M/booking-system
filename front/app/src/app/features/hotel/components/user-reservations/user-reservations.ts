import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../../services/reservation-service';
import { AuthService } from '../../../../core/services/auth-service';
import { Booking } from '../../../../shared/models/booking-model';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-reservations.html',
  styleUrl: './user-reservations.scss'
})
export class UserReservationsComponent implements OnInit {
  reservations = signal<Booking[]>([]);
  isLoading = signal(false);
  error = signal('');
  successMessage = signal('');

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadReservations();
  }

  private loadReservations() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error.set('Debes iniciar sesión para ver tus reservas.');
      return;
    }

    this.isLoading.set(true);
    this.reservationService.getUserReservations(user.id).subscribe({
      next: (res) => {
        this.reservations.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      }
    });
  }

  canCancel(reservation: Booking): boolean {
    return (
      reservation.isActive &&
      this.reservationService.canCancelReservation(reservation.checkInDate)
    );
  }

  cancelReservation(reservation: Booking) {
    if (!this.canCancel(reservation)) {
      return;
    }

    this.reservationService.cancelReservation(reservation.id).subscribe({
      next: () => {
        this.reservations.update((list) =>
          list.filter((r) => r.id !== reservation.id)
        );
        this.successMessage.set('Reserva cancelada exitosamente.');
      },
      error: (err) => this.error.set(err.message)
    });
  }
}

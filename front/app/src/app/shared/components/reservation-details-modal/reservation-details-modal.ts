import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Booking } from '../../models/booking-model';

@Component({
  selector: 'app-reservation-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-details-modal.html',
  styleUrl: './reservation-details-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationDetailsModalComponent {
  @Input() reservation!: Booking;
  @Output() close = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<string>();

  onClose(): void {
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit(this.reservation.id);
  }
}

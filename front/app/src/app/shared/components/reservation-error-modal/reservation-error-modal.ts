import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservation-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-error-modal.html',
  styleUrl: './reservation-error-modal.scss'
})
export class ReservationErrorModalComponent {
  @Input() message = '';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}

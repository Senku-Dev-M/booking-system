import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancellation-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cancellation-confirmation-modal.html',
  styleUrl: './cancellation-confirmation-modal.scss'
})
export class CancellationConfirmationModalComponent {
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}

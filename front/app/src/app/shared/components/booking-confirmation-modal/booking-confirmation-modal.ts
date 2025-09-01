import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BookingData {
  checkInDate: Date;
  checkOutDate: Date;
  userName: string;
  hotelName: string;
  roomDetails: string;
  totalPrice: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

@Component({
  selector: 'app-booking-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-confirmation-modal.html',
  styleUrl: './booking-confirmation-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingConfirmationModalComponent {
  @Input() bookingData!: BookingData;
  @Output() confirmed = new EventEmitter<ContactInfo>();
  @Output() cancelled = new EventEmitter<void>();

  contactInfo = signal<ContactInfo>({
    email: '',
    phone: ''
  });

  constructor() {}

  isFormValid(): boolean {
    const contact = this.contactInfo();
    return this.isValidEmail(contact.email) && this.isValidPhone(contact.phone);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
    return phoneRegex.test(phone.trim());
  }

  onConfirm(): void {
    if (this.isFormValid()) {
      this.confirmed.emit(this.contactInfo());
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  updateEmail(event: Event): void {
    const target = event.target as HTMLInputElement;
    const current = this.contactInfo();
    this.contactInfo.set({
      ...current,
      email: target.value
    });
  }

  updatePhone(event: Event): void {
    const target = event.target as HTMLInputElement;
    const current = this.contactInfo();
    this.contactInfo.set({
      ...current,
      phone: target.value
    });
  }
}

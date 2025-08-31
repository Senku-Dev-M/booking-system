import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header';
import { FooterComponent } from './core/components/footer/footer';
import { RouterOutlet } from '@angular/router';
import { UnauthorizedModalService } from './core/services/unauthorized-modal-service';
import { ReservationErrorModalComponent } from './shared/components/reservation-error-modal/reservation-error-modal';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet, ReservationErrorModalComponent],

  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Hotel Booking App');
  currentCurrency = signal('BOB');

  constructor(public unauthorizedModalService: UnauthorizedModalService) {}

  onCurrencyChange(currency: string) {
    this.currentCurrency.set(currency);
  }
}

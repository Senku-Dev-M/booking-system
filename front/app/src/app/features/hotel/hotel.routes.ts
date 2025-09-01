import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate-guard';

export const HOTEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/hotel-list-page/hotel-list-page').then(
        (m) => m.HotelListPageComponent
      ),
    title: 'Hoteles - Hotel Booking',
  },
  {
    path: ':hotelId/booking',
    loadComponent: () =>
      import('./pages/hotel-booking/hotel-booking').then(
        (m) => m.HotelBookingComponent
      ),
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    title: 'Reservar Hotel - Hotel Booking',
  },
];


import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { HotelListPageComponent } from './features/hotel/pages/hotel-list-page/hotel-list-page';
import { HotelBookingComponent } from './features/hotel/pages/hotel-booking/hotel-booking';
import { NotFoundComponent } from './shared/components/not-found/not-found';
import { AuthGuard } from './core/guards/auth-guard';
import { CanDeactivateGuard } from './core/guards/can-deactivate-guard';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    title: 'Inicio - Hotel Booking'
  },
  { 
    path: 'inicio', 
    redirectTo: '' 
  },
  {
    path: 'hotels',
    component: HotelListPageComponent,
    title: 'Hoteles - Hotel Booking'
  },
  { 
    path: 'hotels/:hotelId/booking', 
    component: HotelBookingComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    title: 'Reservar Hotel - Hotel Booking'
  },
  { 
    path: '404', 
    component: NotFoundComponent,
    title: 'Página no encontrada - Hotel Booking'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

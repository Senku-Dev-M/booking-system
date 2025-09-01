import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then((m) => m.HomeComponent),
    title: 'Inicio - Hotel Booking'
  },
  {
    path: 'inicio',
    redirectTo: ''
  },
  {
    path: 'hotels',
    loadChildren: () =>
      import('./features/hotel/hotel.routes').then((m) => m.HOTEL_ROUTES),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./shared/components/not-found/not-found').then(
        (m) => m.NotFoundComponent
      ),
    title: 'Página no encontrada - Hotel Booking'
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

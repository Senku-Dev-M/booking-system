import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking, CreateBookingRequest } from '../../../shared/models/booking-model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseUrl = 'http://localhost:3000/api/v1/bookings';

  constructor(private http: HttpClient) {}

  createReservation(bookingData: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, bookingData).pipe(
      catchError(this.handleError)
    );
  }

  cancelReservation(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.baseUrl}/${id}/cancel`, {}).pipe(
      catchError(this.handleError)
    );
  }

  // Legacy methods kept for backward compatibility
  createBooking(bookingData: CreateBookingRequest): Observable<Booking> {
    return this.createReservation(bookingData);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.cancelReservation(id);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}?userId=${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  canCancelBooking(checkInDate: string): boolean {
    const checkIn = new Date(checkInDate);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Reservation API error:', error);

    const errorMessage =
      error.error?.message ||
      (error.status === 400
        ? 'Solicitud inválida'
        : error.status === 404
        ? 'Reserva no encontrada'
        : error.status === 0
        ? 'Error de red, intente más tarde'
        : 'Error en el servidor, por favor intente más tarde');

    return throwError(() => new Error(errorMessage));
  }
}
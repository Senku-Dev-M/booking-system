import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Booking,
  CreateBookingRequest
} from '../../../shared/models/booking-model';
import { AuthService } from '../../../core/services/auth-service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly baseUrl = 'http://localhost:3000/api/v1/bookings';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Creates a new reservation using the bookings API
   */
  createReservation(bookingData: CreateBookingRequest): Observable<Booking> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .post<Booking>(this.baseUrl, bookingData, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves all reservations
   */
  getReservations(): Observable<Booking[]> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .get<Booking[]>(this.baseUrl, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves reservations for a specific user
   */
  getUserReservations(userId: string): Observable<Booking[]> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .get<Booking[]>(`${this.baseUrl}?userId=${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves a single reservation by id
   */
  getReservationById(id: string): Observable<Booking> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .get<Booking>(`${this.baseUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancels an existing reservation
   */
  cancelReservation(id: string): Observable<Booking> {
    const token = this.authService.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http
      .patch<Booking>(`${this.baseUrl}/${id}/cancel`, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Validates if a reservation can be cancelled according to the check-in date
   */
  canCancelReservation(checkInDate: string): boolean {
    const checkIn = new Date(checkInDate);
    const today = new Date();
    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('ReservationService error:', error);

    let errorMessage = 'Error al procesar la reserva';
    if (error.status === 400) {
      errorMessage =
        'No se puede cancelar: la fecha de cancelación ha expirado (debe ser 3 días antes)';
    } else if (error.status === 401) {
      errorMessage = 'No autorizado. Por favor, inicia sesión.';
    } else if (error.status === 404) {
      errorMessage = 'Reserva no encontrada';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor, por favor intente más tarde';
    }

    return throwError(() => new Error(errorMessage));
  }
}
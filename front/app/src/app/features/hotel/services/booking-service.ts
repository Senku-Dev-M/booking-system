import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Booking, CreateBookingRequest } from '../../../shared/models/booking-model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:3000/api/v1/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(this.baseUrl, bookingData).pipe(
      catchError(this.handleError)
    );
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

  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.baseUrl}/${id}/cancel`, {}).pipe(
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
    console.error('Error en BookingService:', error);
    
    let errorMessage = 'Error en la reserva';
    if (error.status === 400) {
      errorMessage = 'No se puede cancelar: La fecha de cancelación ha expirado (debe ser 3 días antes)';
    } else if (error.status === 404) {
      errorMessage = 'Reserva no encontrada';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor, por favor intente más tarde';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
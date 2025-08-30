import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Room } from '../../../shared/models/room-model';
import { SearchFilters } from '../../../shared/components/search-bar/search-bar';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/rooms';

  getRoomsByHotel(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}?hotelId=${hotelId}`).pipe(
      catchError(this.handleError)
    );
  }

  searchRooms(filters: SearchFilters): Observable<Room[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.guests) queryParams.append('capacity', filters.guests.toString());
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.checkIn) queryParams.append('checkIn', filters.checkIn);
    if (filters.checkOut) queryParams.append('checkOut', filters.checkOut);
    if (filters.roomType) queryParams.append('type', filters.roomType);

    return this.http.get<Room[]>(`${this.baseUrl}?${queryParams.toString()}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.baseUrl}/${roomId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en RoomService:', error);
    
    let errorMessage = 'No se pudieron cargar las habitaciones';
    if (error.status === 404) {
      errorMessage = 'No se encontraron habitaciones disponibles';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor, por favor intente más tarde';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
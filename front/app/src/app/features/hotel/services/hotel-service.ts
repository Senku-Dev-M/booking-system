import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Hotel } from '../../../shared/models/hotel-model';
import { SearchFilters } from '../../../shared/components/search-bar/search-bar';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/v1/hotels';

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchHotelsByRoomFilters(filters: SearchFilters): Observable<Hotel[]> {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    
    return this.http.get<Hotel[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en HotelService:', error);
    
    let errorMessage = 'No se pudieron cargar los hoteles';
    if (error.status === 404) {
      errorMessage = 'No se encontraron hoteles disponibles';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor, por favor intente más tarde';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté ejecutándose.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}

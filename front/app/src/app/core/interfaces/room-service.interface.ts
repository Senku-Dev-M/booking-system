import { Observable } from 'rxjs';
import { Room } from '../../shared/models/room-model';

export interface RoomSearchFilters {
  people?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;
  checkOut?: string;
  roomType?: string;
}

export interface IRoomService {
  getRoomsByHotel(hotelId: string): Observable<Room[]>;
  searchRooms(filters: RoomSearchFilters): Observable<Room[]>;
  getAllRooms(): Observable<Room[]>;
  getRoomById(roomId: string): Observable<Room>;
}
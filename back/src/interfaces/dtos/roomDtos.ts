import { RoomType, BedType } from '../../domain/entities/room';

export interface CreateRoomRequest {
    hotelId: string;
    roomNumber: string;
    type: RoomType;
    capacity: number;
    beds: BedType[];
    pricePerNight: number;
}

export interface UpdateRoomRequest {
    roomNumber?: string;
    type?: RoomType;
    capacity?: number;
    beds?: BedType[];
    pricePerNight?: number;
    isAvailable?: boolean;
}

export interface SearchRoomsRequest {
    people?: number;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
}

export interface RoomResponse {
    id: string;
    hotelId: string;
    roomNumber: string;
    type: RoomType;
    capacity: number;
    beds: BedType[];
    pricePerNight: number;
    isAvailable: boolean;
}
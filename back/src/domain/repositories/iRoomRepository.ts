import { Room } from '../entities/room';

export interface RoomFilter {
    people?: number;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    hotelId?: string;
}

export interface IRoomRepository {
    create(room: Omit<Room, 'id' | 'isAvailable'>): Promise<Room>;
    findById(id: string): Promise<Room | null>;
    findAll(filters?: RoomFilter): Promise<Room[]>;
    findByHotelId(hotelId: string): Promise<Room[]>;
    update(id: string, updates: Partial<Omit<Room, 'id' | 'hotelId'>>): Promise<Room | null>;
    delete(id: string): Promise<boolean>;
}
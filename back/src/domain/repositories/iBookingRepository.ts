import { Booking } from '../entities/booking';

export interface IBookingRepository {
    create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking>;
    findById(id: string): Promise<Booking | null>;
    findAll(filters?: { userId?: string; isActive?: boolean }): Promise<Booking[]>;
    findByUserId(userId: string): Promise<Booking[]>;
    findByHotelId(hotelId: string): Promise<Booking[]>;
    update(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null>;
    cancel(id: string): Promise<Booking | null>;
    delete(id: string): Promise<boolean>;
}
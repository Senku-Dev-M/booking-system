import { Hotel } from '../entities/hotel';

export interface IHotelRepository {
    create(hotel: Omit<Hotel, 'id'>): Promise<Hotel>;
    findById(id: string): Promise<Hotel | null>;
    findAll(): Promise<Hotel[]>;
    update(id: string, updates: Partial<Omit<Hotel, 'id'>>): Promise<Hotel | null>;
    delete(id: string): Promise<boolean>;
}
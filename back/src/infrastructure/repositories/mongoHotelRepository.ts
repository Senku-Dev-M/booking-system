import { IHotelRepository } from '../../domain/repositories/iHotelRepository';
import { Hotel } from '../../domain/entities/hotel';
import { HotelModel, HotelDocument } from '../database/models/hotelModel';

export class MongoHotelRepository implements IHotelRepository {
    async create(hotelData: Omit<Hotel, 'id'>): Promise<Hotel> {
        const newHotel = new HotelModel(hotelData);
        const savedHotel = await newHotel.save();
        return this.toDomain(savedHotel);
    }

    async findById(id: string): Promise<Hotel | null> {
        const hotel = await HotelModel.findById(id);
        return hotel ? this.toDomain(hotel) : null;
    }

    async findAll(): Promise<Hotel[]> {
        const hotels = await HotelModel.find();
        return hotels.map(this.toDomain);
    }

    async update(id: string, updates: Partial<Omit<Hotel, 'id'>>): Promise<Hotel | null> {
        const updatedHotel = await HotelModel.findByIdAndUpdate(id, updates, { new: true });
        return updatedHotel ? this.toDomain(updatedHotel) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await HotelModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    private toDomain(doc: HotelDocument): Hotel {
        return {
            id: doc._id.toString(),
            name: doc.name,
            location: doc.location,
            description: doc.description,
            amenities: doc.amenities,
            image: doc.image,
            rating: doc.rating,
        };
    }
}
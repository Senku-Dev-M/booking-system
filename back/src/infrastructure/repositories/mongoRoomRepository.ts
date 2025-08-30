import { IRoomRepository, RoomFilter } from '../../domain/repositories/iRoomRepository';
import { Room } from '../../domain/entities/room';
import { RoomModel, RoomDocument } from '../database/models/roomModel';
import { HotelModel } from '../database/models/hotelModel';

export class MongoRoomRepository implements IRoomRepository {
    async create(roomData: Omit<Room, 'id' | 'isAvailable'>): Promise<Room> {
        const newRoom = new RoomModel(roomData);
        const savedRoom = await newRoom.save();
        return this.toDomain(savedRoom);
    }

    async findById(id: string): Promise<Room | null> {
        const room = await RoomModel.findById(id);
        return room ? this.toDomain(room) : null;
    }

    async findByHotelId(hotelId: string): Promise<Room[]> {
        const rooms = await RoomModel.find({ hotelId: hotelId, isAvailable: true });
        return rooms.map(this.toDomain);
    }
    
    async findAll(filters?: RoomFilter): Promise<Room[]> {
        let query: any = { isAvailable: true };
    
        if (filters?.hotelId) {
            query.hotelId = filters.hotelId;
        }
    
        if (filters?.people) {
            query.capacity = { $gte: filters.people };
        }
    
        if (filters?.minPrice || filters?.maxPrice) {
            query.pricePerNight = {};
            if (filters.minPrice) {
                query.pricePerNight.$gte = filters.minPrice;
            }
            if (filters.maxPrice) {
                query.pricePerNight.$lte = filters.maxPrice;
            }
        }
    
        if (filters?.location) {
            const hotelsInLocation = await HotelModel.find({ location: { $regex: filters.location, $options: 'i' } }).select('_id');
            const hotelIds = hotelsInLocation.map(hotel => hotel._id);
            if (hotelIds.length > 0) {
                query.hotelId = { $in: hotelIds };
            } else {
                return [];
            }
        }
    
        const rooms = await RoomModel.find(query);
        return rooms.map(this.toDomain);
    }

    async update(id: string, updates: Partial<Omit<Room, 'id' | 'hotelId'>>): Promise<Room | null> {
        const updatedRoom = await RoomModel.findByIdAndUpdate(id, updates, { new: true });
        return updatedRoom ? this.toDomain(updatedRoom) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await RoomModel.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }

    private toDomain(doc: RoomDocument): Room {
        return {
            id: doc._id.toString(),
            hotelId: doc.hotelId.toString(),
            roomNumber: doc.roomNumber,
            type: doc.type,
            capacity: doc.capacity,
            beds: doc.beds,
            pricePerNight: doc.pricePerNight,
            isAvailable: doc.isAvailable
        };
    }
}
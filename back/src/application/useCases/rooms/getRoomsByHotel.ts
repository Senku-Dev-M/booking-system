import { Room } from '../../../domain/entities/room';
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class GetRoomsByHotelUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(hotelId: string): Promise<Room[]> {
        if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
            throw new ValidationError('ID de hotel inválido.');
        }

        return this.roomRepository.findByHotelId(hotelId);
    }
}
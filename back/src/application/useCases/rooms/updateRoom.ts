import { Room } from '../../../domain/entities/room';
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class UpdateRoomUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(id: string, updates: Partial<Omit<Room, 'id' | 'hotelId'>>): Promise<Room> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de habitacion invalido.');
        }
        if (Object.keys(updates).length === 0) {
            throw new ValidationError('Se requieren datos para la actualizacion.');
        }
        if (updates.capacity !== undefined && updates.capacity <= 0) {
            throw new ValidationError('La capacidad debe ser un numero positivo.');
        }
        if (updates.pricePerNight !== undefined && updates.pricePerNight <= 0) {
            throw new ValidationError('El precio por noche debe ser un numero positivo.');
        }

        const updatedRoom = await this.roomRepository.update(id, updates);
        if (!updatedRoom) {
            throw new NotFoundError(`Habitacion con ID ${id} no encontrada.`);
        }
        return updatedRoom;
    }
}
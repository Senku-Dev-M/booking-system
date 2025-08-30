import { Room } from '../../../domain/entities/room';
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class GetRoomByIdUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(id: string): Promise<Room> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de habitacion invalido.');
        }

        const room = await this.roomRepository.findById(id);
        if (!room) {
            throw new NotFoundError(`Habitacion con ID ${id} no encontrada.`);
        }
        return room;
    }
}
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class DeleteRoomUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de habitacion invalido.');
        }

        const deleted = await this.roomRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Habitacion con ID ${id} no encontrada o ya eliminada.`);
        }
    }
}
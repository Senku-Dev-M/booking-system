import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class DeleteHotelUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    async execute(id: string): Promise<void> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de hotel invalido.');
        }

        const deleted = await this.hotelRepository.delete(id);
        if (!deleted) {
            throw new NotFoundError(`Hotel con ID ${id} no encontrado o ya eliminado.`);
        }
    }
}
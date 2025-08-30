import { Hotel } from '../../../domain/entities/hotel';
import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class UpdateHotelUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    async execute(id: string, updates: Partial<Omit<Hotel, 'id'>>): Promise<Hotel> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de hotel invalido.');
        }

        if (Object.keys(updates).length === 0) {
            throw new ValidationError('Se requieren datos para la actualizacion.');
        }

        const updatedHotel = await this.hotelRepository.update(id, updates);
        if (!updatedHotel) {
            throw new NotFoundError(`Hotel con ID ${id} no encontrado.`);
        }
        return updatedHotel;
    }
}
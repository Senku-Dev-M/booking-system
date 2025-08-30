import { Hotel } from '../../../domain/entities/hotel';
import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class GetHotelByIdUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    async execute(id: string): Promise<Hotel> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de hotel invalido.');
        }

        const hotel = await this.hotelRepository.findById(id);
        if (!hotel) {
            throw new NotFoundError(`Hotel con ID ${id} no encontrado.`);
        }
        return hotel;
    }
}
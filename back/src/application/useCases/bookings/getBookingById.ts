import { Booking } from '../../../domain/entities/booking';
import { IBookingRepository } from '../../../domain/repositories/iBookingRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class GetBookingByIdUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute(id: string): Promise<Booking> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de booking inválido.');
        }

        const booking = await this.bookingRepository.findById(id);
        if (!booking) {
            throw new NotFoundError(`Booking con ID ${id} no encontrado.`);
        }
        return booking;
    }
}
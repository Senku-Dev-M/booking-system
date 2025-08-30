import { Booking } from '../../../domain/entities/booking';
import { IBookingRepository } from '../../../domain/repositories/iBookingRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';

export class UpdateBookingUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ValidationError('ID de booking inválido.');
        }

        if (updates.checkInDate && updates.checkOutDate) {
            if (new Date(updates.checkInDate) >= new Date(updates.checkOutDate)) {
                throw new ValidationError('La fecha de check-out debe ser posterior a la de check-in.');
            }
        }

        if (updates.numberOfGuests && updates.numberOfGuests < 1) {
            throw new ValidationError('El número de huéspedes debe ser al menos 1.');
        }

        const updatedBooking = await this.bookingRepository.update(id, updates);
        if (!updatedBooking) {
            throw new NotFoundError(`Booking con ID ${id} no encontrado.`);
        }
        return updatedBooking;
    }
}
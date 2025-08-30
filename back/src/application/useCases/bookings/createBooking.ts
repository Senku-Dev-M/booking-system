import { Booking } from '../../../domain/entities/booking';
import { IBookingRepository } from '../../../domain/repositories/iBookingRepository';
import { ValidationError } from '../../../domain/exceptions/validationError';

export class CreateBookingUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute(bookingData: Omit<Booking, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
        if (!bookingData.userId || !bookingData.hotelId || !bookingData.roomId) {
            throw new ValidationError('userId, hotelId y roomId son obligatorios.');
        }

        if (!bookingData.checkInDate || !bookingData.checkOutDate) {
            throw new ValidationError('Las fechas de check-in y check-out son obligatorias.');
        }

        if (new Date(bookingData.checkInDate) >= new Date(bookingData.checkOutDate)) {
            throw new ValidationError('La fecha de check-out debe ser posterior a la de check-in.');
        }

        if (bookingData.numberOfGuests < 1) {
            throw new ValidationError('El número de huéspedes debe ser al menos 1.');
        }

        if (bookingData.totalPrice <= 0) {
            throw new ValidationError('El precio total debe ser mayor a 0.');
        }

        if (!bookingData.contactEmail || !bookingData.contactPhone) {
            throw new ValidationError('Email y teléfono de contacto son obligatorios.');
        }

        return this.bookingRepository.create({
            ...bookingData,
            isActive: true
        });
    }
}
import { Booking } from '../../../domain/entities/booking';
import { IBookingRepository } from '../../../domain/repositories/iBookingRepository';

export class GetBookingsUseCase {
    constructor(private bookingRepository: IBookingRepository) {}

    async execute(filters?: { userId?: string; isActive?: boolean }): Promise<Booking[]> {
        return this.bookingRepository.findAll(filters);
    }
}
import { Hotel } from '../../../domain/entities/hotel';
import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';
import { ValidationError } from '../../../domain/exceptions/validationError';

export class CreateHotelUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    async execute(hotelData: Omit<Hotel, 'id'>): Promise<Hotel> {
        if (!hotelData.name || !hotelData.location) {
            throw new ValidationError('El nombre y la ubicacion del hotel son obligatorios.');
        }
        return this.hotelRepository.create(hotelData);
    }
}
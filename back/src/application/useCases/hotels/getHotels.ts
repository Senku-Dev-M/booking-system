import { Hotel } from '../../../domain/entities/hotel';
import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';

export class GetHotelsUseCase {
    constructor(private hotelRepository: IHotelRepository) {}

    async execute(): Promise<Hotel[]> {
        return this.hotelRepository.findAll();
    }
}
import { Room } from '../../../domain/entities/room';
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';
import { ValidationError } from '../../../domain/exceptions/validationError';
import mongoose from 'mongoose';
import { IHotelRepository } from '../../../domain/repositories/iHotelRepository';
import { NotFoundError } from '../../../domain/exceptions/notFoundError';

export class CreateRoomUseCase {
    constructor(
        private roomRepository: IRoomRepository,
        private hotelRepository: IHotelRepository
    ) {}

    async execute(roomData: Omit<Room, 'id' | 'isAvailable'>): Promise<Room> {
        const errors: string[] = [];

        if (!roomData.hotelId || !mongoose.Types.ObjectId.isValid(roomData.hotelId)) {
            errors.push('ID de hotel invalido o ausente.');
        }
        if (!roomData.roomNumber) {
            errors.push('El número de habitacion es obligatorio.');
        }
        if (!roomData.type) {
            errors.push('El tipo de habitacion es obligatorio.');
        }
        if (roomData.capacity === undefined || roomData.capacity <= 0) {
            errors.push('La capacidad debe ser un numero positivo.');
        }
        if (roomData.pricePerNight === undefined || roomData.pricePerNight <= 0) {
            errors.push('El precio por noche debe ser un numero positivo.');
        }

        if (errors.length > 0) {
            throw new ValidationError('Datos de habitacion invalidos.', errors);
        }

        const hotelExists = await this.hotelRepository.findById(roomData.hotelId);
        if (!hotelExists) {
            throw new NotFoundError(`Hotel con ID ${roomData.hotelId} no encontrado.`);
        }

        return this.roomRepository.create(roomData);
    }
}
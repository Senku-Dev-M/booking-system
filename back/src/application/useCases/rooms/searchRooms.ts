import { Room } from '../../../domain/entities/room';
import { IRoomRepository, RoomFilter } from '../../../domain/repositories/iRoomRepository';
import { ValidationError } from '../../../domain/exceptions/validationError';

export class SearchRoomsUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(filters: RoomFilter): Promise<Room[]> {
        const errors: string[] = [];

        if (filters.people !== undefined) {
            const peopleNum = Number(filters.people);
            if (isNaN(peopleNum) || peopleNum <= 0) {
                errors.push('El numero de personas debe ser un numero positivo.');
            } else {
                filters.people = peopleNum;
            }
        }

        if (filters.minPrice !== undefined) {
            const minPriceNum = Number(filters.minPrice);
            if (isNaN(minPriceNum) || minPriceNum < 0) {
                errors.push('El precio minimo debe ser un numero no negativo.');
            } else {
                filters.minPrice = minPriceNum;
            }
        }

        if (filters.maxPrice !== undefined) {
            const maxPriceNum = Number(filters.maxPrice);
            if (isNaN(maxPriceNum) || maxPriceNum < 0) {
                errors.push('El precio maximo debe ser un numero no negativo.');
            } else {
                filters.maxPrice = maxPriceNum;
            }
        }

        if (filters.minPrice !== undefined && filters.maxPrice !== undefined && filters.minPrice > filters.maxPrice) {
            errors.push('El precio minimo no puede ser mayor que el precio maximo.');
        }

        if (errors.length > 0) {
            throw new ValidationError('Filtros de busqueda invalidos.', errors);
        }

        const rooms = await this.roomRepository.findAll(filters);
        return rooms;
    }
}
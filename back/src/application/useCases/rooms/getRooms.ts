import { Room } from '../../../domain/entities/room';
import { IRoomRepository } from '../../../domain/repositories/iRoomRepository';

export class GetRoomsUseCase {
    constructor(private roomRepository: IRoomRepository) {}

    async execute(): Promise<Room[]> {
        return this.roomRepository.findAll();
    }
}
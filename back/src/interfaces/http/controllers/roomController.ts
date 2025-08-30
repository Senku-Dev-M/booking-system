import { Request, Response, NextFunction } from 'express';
import { CreateRoomUseCase } from '../../../application/useCases/rooms/createRoom';
import { GetRoomsUseCase } from '../../../application/useCases/rooms/getRooms';
import { GetRoomsByHotelUseCase } from '../../../application/useCases/rooms/getRoomsByHotel';
import { GetRoomByIdUseCase } from '../../../application/useCases/rooms/getRoomById';
import { UpdateRoomUseCase } from '../../../application/useCases/rooms/updateRoom';
import { DeleteRoomUseCase } from '../../../application/useCases/rooms/deleteRoom';
import { SearchRoomsUseCase } from '../../../application/useCases/rooms/searchRooms';
import { CreateRoomRequest, UpdateRoomRequest, RoomResponse, SearchRoomsRequest } from '../../dtos/roomDtos';

export class RoomController {

    constructor(
        private createRoomUseCase: CreateRoomUseCase,
        private getRoomsUseCase: GetRoomsUseCase,
        private getRoomsByHotelUseCase: GetRoomsByHotelUseCase, // ← Agregar
        private getRoomByIdUseCase: GetRoomByIdUseCase,
        private updateRoomUseCase: UpdateRoomUseCase,
        private deleteRoomUseCase: DeleteRoomUseCase,
        private searchRoomsUseCase: SearchRoomsUseCase
    ) {}
    
    // Modificar el método getRooms
    async getRooms(req: Request<{}, {}, {}, SearchRoomsRequest & { hotelId?: string }>, res: Response<RoomResponse[]>, next: NextFunction) {
        try {
            const { hotelId, ...filters } = req.query;
            
            let rooms: RoomResponse[];
            if (hotelId) {
                // Si se proporciona hotelId, usar el caso de uso específico
                rooms = await this.getRoomsByHotelUseCase.execute(hotelId);
            } else {
                // Si no, usar búsqueda general
                rooms = await this.searchRoomsUseCase.execute(filters);
            }
            
            res.status(200).json(rooms);
        } catch (error) {
            next(error);
        }
    }

    async getRoomById(req: Request<{ id: string }>, res: Response<RoomResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const room = await this.getRoomByIdUseCase.execute(id);
            res.status(200).json(room);
        } catch (error) {
            next(error);
        }
    }

    async updateRoom(req: Request<{ id: string }, {}, UpdateRoomRequest>, res: Response<RoomResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedRoom = await this.updateRoomUseCase.execute(id, updates);
            res.status(200).json(updatedRoom);
        } catch (error) {
            next(error);
        }
    }

    async deleteRoom(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.deleteRoomUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
    
    // Agregar este método después del constructor (línea 22)
    async createRoom(req: Request<{}, {}, CreateRoomRequest>, res: Response<RoomResponse>, next: NextFunction) {
        try {
            const roomData = req.body;
            const newRoom = await this.createRoomUseCase.execute(roomData);
            res.status(201).json(newRoom);
        } catch (error) {
            next(error);
        }
    }
}
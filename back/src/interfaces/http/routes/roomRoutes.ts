import { Router, Request, Response, NextFunction } from 'express';
import { CreateRoomRequest, UpdateRoomRequest, SearchRoomsRequest } from '../../dtos/roomDtos';
import { authMiddleware } from '../../../infrastructure/web/authMiddleware';
import { RoomController } from '../controllers/roomController';
import { MongoRoomRepository } from '../../../infrastructure/repositories/mongoRoomRepository';
import { MongoHotelRepository } from '../../../infrastructure/repositories/mongoHotelRepository';
import { CreateRoomUseCase } from '../../../application/useCases/rooms/createRoom';
import { GetRoomsUseCase } from '../../../application/useCases/rooms/getRooms';
import { GetRoomByIdUseCase } from '../../../application/useCases/rooms/getRoomById';
import { GetRoomsByHotelUseCase } from '../../../application/useCases/rooms/getRoomsByHotel';
import { UpdateRoomUseCase } from '../../../application/useCases/rooms/updateRoom';
import { DeleteRoomUseCase } from '../../../application/useCases/rooms/deleteRoom';
import { SearchRoomsUseCase } from '../../../application/useCases/rooms/searchRooms';
import { validateFields, validateNumericFields } from '../middlewares/validationMiddleware';


const router = Router();

const roomRepository = new MongoRoomRepository();
const hotelRepository = new MongoHotelRepository();

const createRoomUseCase = new CreateRoomUseCase(roomRepository, hotelRepository);
const getRoomsUseCase = new GetRoomsUseCase(roomRepository);
const getRoomByIdUseCase = new GetRoomByIdUseCase(roomRepository);
const updateRoomUseCase = new UpdateRoomUseCase(roomRepository);
const deleteRoomUseCase = new DeleteRoomUseCase(roomRepository);
const searchRoomsUseCase = new SearchRoomsUseCase(roomRepository);
const getRoomsByHotelUseCase = new GetRoomsByHotelUseCase(roomRepository);

const roomController = new RoomController(
    createRoomUseCase,
    getRoomsUseCase,
    getRoomsByHotelUseCase,
    getRoomByIdUseCase,
    updateRoomUseCase,
    deleteRoomUseCase,
    searchRoomsUseCase
);

const createRoomValidator = [
  validateFields(['hotelId', 'roomNumber', 'type', 'capacity', 'beds', 'pricePerNight']),
  validateNumericFields(['capacity', 'pricePerNight'])
];

const updateRoomValidator = [
  validateFields([]),
  validateNumericFields(['capacity', 'pricePerNight'])
];

router.post('/', createRoomValidator, (req: Request<{}, {}, CreateRoomRequest>, res: Response, next: NextFunction) => roomController.createRoom(req, res, next)); 

router.get('/', (req: Request<{}, {}, {}, SearchRoomsRequest>, res: Response, next: NextFunction) => roomController.getRooms(req, res, next));
router.get('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction) => roomController.getRoomById(req, res, next));
router.put('/:id', updateRoomValidator, (req: Request<{ id: string }, {}, UpdateRoomRequest>, res: Response, next: NextFunction) => roomController.updateRoom(req, res, next));
router.delete('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction) => roomController.deleteRoom(req, res, next));

export default router;
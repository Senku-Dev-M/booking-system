import { Router, Request, Response, NextFunction } from 'express';
import { CreateHotelRequest, UpdateHotelRequest } from '../../dtos/hotelDtos';
import { authMiddleware } from '../../../infrastructure/web/authMiddleware';
import { HotelController } from '../controllers/hotelController';
import { MongoHotelRepository } from '../../../infrastructure/repositories/mongoHotelRepository';
import { CreateHotelUseCase } from '../../../application/useCases/hotels/createHotel';
import { GetHotelsUseCase } from '../../../application/useCases/hotels/getHotels';
import { GetHotelByIdUseCase } from '../../../application/useCases/hotels/getHotelById';
import { UpdateHotelUseCase } from '../../../application/useCases/hotels/updateHotel';
import { DeleteHotelUseCase } from '../../../application/useCases/hotels/deleteHotel';
import { validateFields } from '../middlewares/validationMiddleware';

const router = Router();

// ❌ ELIMINAR esta línea para quitar autenticación global
// router.use(authMiddleware);

const hotelRepository = new MongoHotelRepository();

const createHotelUseCase = new CreateHotelUseCase(hotelRepository);
const getHotelsUseCase = new GetHotelsUseCase(hotelRepository);
const getHotelByIdUseCase = new GetHotelByIdUseCase(hotelRepository);
const updateHotelUseCase = new UpdateHotelUseCase(hotelRepository);
const deleteHotelUseCase = new DeleteHotelUseCase(hotelRepository);

const hotelController = new HotelController(
    createHotelUseCase,
    getHotelsUseCase,
    getHotelByIdUseCase,
    updateHotelUseCase,
    deleteHotelUseCase
);

const createHotelValidator = validateFields(['name', 'location']);
const updateHotelValidator = validateFields([]);

router.post('/', authMiddleware, createHotelValidator, (req: Request<{}, {}, CreateHotelRequest>, res: Response, next: NextFunction) => hotelController.createHotel(req, res, next));
router.get('/', (req: Request, res: Response, next: NextFunction) => hotelController.getHotels(req, res, next)); // ✅ SIN autenticación
router.get('/:id', (req: Request<{ id: string }>, res: Response, next: NextFunction) => hotelController.getHotelById(req, res, next)); // ✅ SIN autenticación
router.put('/:id', authMiddleware, updateHotelValidator, (req: Request<{ id: string }, {}, UpdateHotelRequest>, res: Response, next: NextFunction) => hotelController.updateHotel(req, res, next));
router.delete('/:id', authMiddleware, (req: Request<{ id: string }>, res: Response, next: NextFunction) => hotelController.deleteHotel(req, res, next));

export default router;
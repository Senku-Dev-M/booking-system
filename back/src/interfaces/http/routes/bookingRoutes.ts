import { Router, Request, Response, NextFunction } from 'express';
import { CreateBookingRequest, UpdateBookingRequest } from '../../dtos/bookingDtos';
import { authMiddleware } from '../../../infrastructure/web/authMiddleware';
import { BookingController } from '../controllers/bookingController';
import { MongoBookingRepository } from '../../../infrastructure/repositories/mongoBookingRepository';
import { CreateBookingUseCase } from '../../../application/useCases/bookings/createBooking';
import { GetBookingsUseCase } from '../../../application/useCases/bookings/getBookings';
import { GetBookingByIdUseCase } from '../../../application/useCases/bookings/getBookingById';
import { UpdateBookingUseCase } from '../../../application/useCases/bookings/updateBooking';
import { CancelBookingUseCase } from '../../../application/useCases/bookings/cancelBooking';
import { validateFields } from '../middlewares/validationMiddleware';

const router = Router();
router.use(authMiddleware);

const bookingRepository = new MongoBookingRepository();

const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);
const getBookingByIdUseCase = new GetBookingByIdUseCase(bookingRepository);
const updateBookingUseCase = new UpdateBookingUseCase(bookingRepository);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

const bookingController = new BookingController(
    createBookingUseCase,
    getBookingsUseCase,
    getBookingByIdUseCase,
    updateBookingUseCase,
    cancelBookingUseCase
);

const createBookingValidator = validateFields([
    'userId', 'hotelId', 'roomId', 'checkInDate', 'checkOutDate', 
    'numberOfGuests', 'totalPrice', 'contactEmail', 'contactPhone'
]);
const updateBookingValidator = validateFields([]);

router.post('/', authMiddleware, createBookingValidator, (req: Request<{}, {}, CreateBookingRequest>, res: Response, next: NextFunction) => 
    bookingController.createBooking(req, res, next)
);

router.get('/', authMiddleware, (req: Request, res: Response, next: NextFunction) => 
    bookingController.getBookings(req, res, next)
);

router.get('/:id', authMiddleware, (req: Request<{ id: string }>, res: Response, next: NextFunction) => 
    bookingController.getBookingById(req, res, next)
);

router.put('/:id', authMiddleware, updateBookingValidator, (req: Request<{ id: string }, {}, UpdateBookingRequest>, res: Response, next: NextFunction) => 
    bookingController.updateBooking(req, res, next)
);

router.patch('/:id/cancel', authMiddleware, (req: Request<{ id: string }>, res: Response, next: NextFunction) => 
    bookingController.cancelBooking(req, res, next)
);

export default router;
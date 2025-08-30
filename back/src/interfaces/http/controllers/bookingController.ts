import { Request, Response, NextFunction } from 'express';
import { CreateBookingUseCase } from '../../../application/useCases/bookings/createBooking';
import { GetBookingsUseCase } from '../../../application/useCases/bookings/getBookings';
import { GetBookingByIdUseCase } from '../../../application/useCases/bookings/getBookingById';
import { UpdateBookingUseCase } from '../../../application/useCases/bookings/updateBooking';
import { CancelBookingUseCase } from '../../../application/useCases/bookings/cancelBooking';
import { CreateBookingRequest, UpdateBookingRequest, BookingResponse } from '../../dtos/bookingDtos';

export class BookingController {
    constructor(
        private createBookingUseCase: CreateBookingUseCase,
        private getBookingsUseCase: GetBookingsUseCase,
        private getBookingByIdUseCase: GetBookingByIdUseCase,
        private updateBookingUseCase: UpdateBookingUseCase,
        private cancelBookingUseCase: CancelBookingUseCase
    ) {}

    async createBooking(req: Request<{}, {}, CreateBookingRequest>, res: Response<BookingResponse>, next: NextFunction) {
        try {
            const bookingData = {
                ...req.body,
                checkInDate: new Date(req.body.checkInDate),
                checkOutDate: new Date(req.body.checkOutDate)
            };
            const newBooking = await this.createBookingUseCase.execute(bookingData);
            res.status(201).json(newBooking);
        } catch (error) {
            next(error);
        }
    }

    async getBookings(req: Request, res: Response<BookingResponse[]>, next: NextFunction) {
        try {
            const { userId, isActive } = req.query;
            const filters: any = {};
            if (userId) filters.userId = userId as string;
            if (isActive !== undefined) filters.isActive = isActive === 'true';
            
            const bookings = await this.getBookingsUseCase.execute(filters);
            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    }

    async getBookingById(req: Request<{ id: string }>, res: Response<BookingResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const booking = await this.getBookingByIdUseCase.execute(id);
            res.status(200).json(booking);
        } catch (error) {
            next(error);
        }
    }

    async updateBooking(req: Request<{ id: string }, {}, UpdateBookingRequest>, res: Response<BookingResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const updates: any = { ...req.body };
            
            if (updates.checkInDate) updates.checkInDate = new Date(updates.checkInDate);
            if (updates.checkOutDate) updates.checkOutDate = new Date(updates.checkOutDate);
            
            const updatedBooking = await this.updateBookingUseCase.execute(id, updates);
            res.status(200).json(updatedBooking);
        } catch (error) {
            next(error);
        }
    }

    async cancelBooking(req: Request<{ id: string }>, res: Response<BookingResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const cancelledBooking = await this.cancelBookingUseCase.execute(id);
            res.status(200).json(cancelledBooking);
        } catch (error) {
            next(error);
        }
    }
}
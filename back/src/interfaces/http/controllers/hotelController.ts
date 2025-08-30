import { Request, Response, NextFunction } from 'express';
import { CreateHotelUseCase } from '../../../application/useCases/hotels/createHotel';
import { GetHotelsUseCase } from '../../../application/useCases/hotels/getHotels';
import { GetHotelByIdUseCase } from '../../../application/useCases/hotels/getHotelById';
import { UpdateHotelUseCase } from '../../../application/useCases/hotels/updateHotel';
import { DeleteHotelUseCase } from '../../../application/useCases/hotels/deleteHotel';
import { CreateHotelRequest, UpdateHotelRequest, HotelResponse } from '../../dtos/hotelDtos';

export class HotelController {
    constructor(
        private createHotelUseCase: CreateHotelUseCase,
        private getHotelsUseCase: GetHotelsUseCase,
        private getHotelByIdUseCase: GetHotelByIdUseCase,
        private updateHotelUseCase: UpdateHotelUseCase,
        private deleteHotelUseCase: DeleteHotelUseCase
    ) {}

    async createHotel(req: Request<{}, {}, CreateHotelRequest>, res: Response<HotelResponse>, next: NextFunction) {
        try {
            const hotelData = req.body;
            const newHotel = await this.createHotelUseCase.execute(hotelData);
            res.status(201).json(newHotel);
        } catch (error) {
            next(error);
        }
    }

    async getHotels(req: Request, res: Response<HotelResponse[]>, next: NextFunction) {
        try {
            const hotels = await this.getHotelsUseCase.execute();
            res.status(200).json(hotels);
        } catch (error) {
            next(error);
        }
    }

    async getHotelById(req: Request<{ id: string }>, res: Response<HotelResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const hotel = await this.getHotelByIdUseCase.execute(id);
            res.status(200).json(hotel);
        } catch (error) {
            next(error);
        }
    }

    async updateHotel(req: Request<{ id: string }, {}, UpdateHotelRequest>, res: Response<HotelResponse>, next: NextFunction) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedHotel = await this.updateHotelUseCase.execute(id, updates);
            res.status(200).json(updatedHotel);
        } catch (error) {
            next(error);
        }
    }

    async deleteHotel(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await this.deleteHotelUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
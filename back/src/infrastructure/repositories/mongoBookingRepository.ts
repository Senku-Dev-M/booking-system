import { IBookingRepository } from '../../domain/repositories/iBookingRepository';
import { Booking } from '../../domain/entities/booking';
import { BookingModel } from '../database/models/bookingModel';
import mongoose from 'mongoose';

export class MongoBookingRepository implements IBookingRepository {
    async create(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
        const booking = new BookingModel({
            ...bookingData,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const savedBooking = await booking.save();
        return this.mapToEntity(savedBooking);
    }

    async findById(id: string): Promise<Booking | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const booking = await BookingModel.findById(id);
        return booking ? this.mapToEntity(booking) : null;
    }

    async findAll(filters?: { userId?: string; isActive?: boolean }): Promise<Booking[]> {
        const query: any = {};
        if (filters?.userId) query.userId = filters.userId;
        if (filters?.isActive !== undefined) query.isActive = filters.isActive;
        
        const bookings = await BookingModel.find(query).sort({ createdAt: -1 });
        return bookings.map(booking => this.mapToEntity(booking));
    }

    async findByUserId(userId: string): Promise<Booking[]> {
        const bookings = await BookingModel.find({ userId }).sort({ createdAt: -1 });
        return bookings.map(booking => this.mapToEntity(booking));
    }

    async findByHotelId(hotelId: string): Promise<Booking[]> {
        const bookings = await BookingModel.find({ hotelId }).sort({ createdAt: -1 });
        return bookings.map(booking => this.mapToEntity(booking));
    }

    async update(id: string, updates: Partial<Omit<Booking, 'id' | 'createdAt'>>): Promise<Booking | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const booking = await BookingModel.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: new Date() },
            { new: true }
        );
        return booking ? this.mapToEntity(booking) : null;
    }

    async cancel(id: string): Promise<Booking | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return null;
        }
        const booking = await BookingModel.findByIdAndUpdate(
            id,
            { isActive: false, updatedAt: new Date() },
            { new: true }
        );
        return booking ? this.mapToEntity(booking) : null;
    }

    async delete(id: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false;
        }
        const result = await BookingModel.findByIdAndDelete(id);
        return !!result;
    }

    private mapToEntity(bookingDoc: any): Booking {
        return {
            id: bookingDoc._id.toString(),
            userId: bookingDoc.userId,
            hotelId: bookingDoc.hotelId,
            roomId: bookingDoc.roomId,
            checkInDate: bookingDoc.checkInDate,
            checkOutDate: bookingDoc.checkOutDate,
            numberOfGuests: bookingDoc.numberOfGuests,
            totalPrice: bookingDoc.totalPrice,
            contactEmail: bookingDoc.contactEmail,
            contactPhone: bookingDoc.contactPhone,
            isActive: bookingDoc.isActive,
            createdAt: bookingDoc.createdAt,
            updatedAt: bookingDoc.updatedAt
        };
    }
}
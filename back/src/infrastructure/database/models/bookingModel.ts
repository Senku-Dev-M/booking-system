import mongoose, { Schema, Document } from 'mongoose';

interface IBookingDocument extends Document {
    userId: string;
    hotelId: string;
    roomId: string;
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    totalPrice: number;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBookingDocument>({
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },
    roomId: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

bookingSchema.index({ userId: 1 });
bookingSchema.index({ hotelId: 1 });
bookingSchema.index({ isActive: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 });

export const BookingModel = mongoose.model<IBookingDocument>('Booking', bookingSchema);
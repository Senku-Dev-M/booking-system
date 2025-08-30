export interface Booking {
    id: string;
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
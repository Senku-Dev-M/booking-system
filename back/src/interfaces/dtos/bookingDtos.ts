export interface CreateBookingRequest {
    userId: string;
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    totalPrice: number;
    contactEmail: string;
    contactPhone: string;
}

export interface UpdateBookingRequest {
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    contactEmail?: string;
    contactPhone?: string;
}

export interface BookingResponse {
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

export interface BookingListResponse {
    bookings: BookingResponse[];
    total: number;
}
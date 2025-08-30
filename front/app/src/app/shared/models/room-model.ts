export type RoomType = 
    "individual_1_bed" | 
    "individual_2_beds" | 
    "individual_3_beds" | 
    "suite_large_bed" | 
    "suite_large_small_bed";

export type BedType = "single" | "double" | "king";

export interface Room {
    id: string;
    hotelId: string;
    roomNumber: string;
    type: RoomType;
    capacity: number;
    beds: BedType[];
    pricePerNight: number;
    isAvailable: boolean;
}

export interface BookingData {
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
}